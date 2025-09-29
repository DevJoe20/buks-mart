"use client"

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { supabase } from "../../../../supabaseClient";

export default function Dashboard() {
  const [totals, setTotals] = useState({ customers: 0, orders: 0, revenue: 0 });
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    // Fetch totals
    const { count: customersCount } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true });

    const { count: ordersCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    const { data: revenueData } = await supabase
      .from("orders")
      .select("total_amount");

    const totalRevenue = revenueData?.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    ) || 0;

    setTotals({
      customers: customersCount || 0,
      orders: ordersCount || 0,
      revenue: totalRevenue,
    });

    // Fetch recent customers (latest 5)
    const { data: latestCustomers } = await supabase
      .from("customers")
      .select("id, full_name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    setRecentCustomers(latestCustomers || []);

    // Fetch recent orders (latest 5)
    const { data: latestOrders } = await supabase
      .from("orders")
      .select("id, total_amount, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    setRecentOrders(latestOrders || []);

    // Revenue trend (group by month)
    const { data: orders } = await supabase
      .from("orders")
      .select("total_amount, created_at");

    if (orders) {
      const monthly = {};

      orders.forEach(order => {
        const date = new Date(order.created_at);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        monthly[key] = (monthly[key] || 0) + Number(order.total_amount || 0);
      });

      const chartData = Object.keys(monthly).map(key => ({
        month: key,
        revenue: monthly[key],
      }));

      setRevenueTrend(chartData);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-2xl p-4 text-center">
          <h3 className="text-lg font-semibold">Total Customers</h3>
          <p className="text-2xl font-bold">{totals.customers}</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-4 text-center">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-2xl font-bold">{totals.orders}</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-4 text-center">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold">£{totals.revenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Trend (per month)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Customers */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Customers</h3>
        <ul className="space-y-2">
          {recentCustomers.map(c => (
            <li key={c.id} className="border-b pb-2">
              <p className="font-medium">{c.full_name}</p>
              <p className="text-sm text-gray-500">{c.email}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <ul className="space-y-2">
          {recentOrders.map(o => (
            <li key={o.id} className="border-b pb-2 flex justify-between">
              <span>£{o.total_amount.toFixed(2)}</span>
              <span className="text-sm text-gray-600">{o.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

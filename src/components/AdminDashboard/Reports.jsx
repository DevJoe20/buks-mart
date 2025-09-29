"use client"
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

const Reports = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    customersCount: 0,
  });

  useEffect(() => {
    const fetchReports = async () => {
      // Total Orders
      const { count: totalOrders } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true });

      // Total Revenue
      const { data: revenueData } = await supabase
        .from("orders")
        .select("total_amount");
      const totalRevenue = revenueData?.reduce(
        (acc, order) => acc + Number(order.total_amount),
        0
      );

      // Customers Count
      const { count: customersCount } = await supabase
        .from("customers")
        .select("id", { count: "exact", head: true });

      setStats({
        totalOrders,
        totalRevenue,
        customersCount,
      });
    };

    fetchReports();
  }, []);

  const cards = [
    { title: "Total Customers", value: stats.customersCount },
    { title: "Total Orders", value: stats.totalOrders },
    { title: "Total Revenue", value: `£${stats.totalRevenue.toFixed(2)}` },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Reports</h2>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="p-4 bg-gray-100 rounded shadow text-center">
            <h3 className="font-semibold text-gray-700">{c.title}</h3>
            <p className="text-lg font-bold text-gray-900">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {cards.map((c, i) => (
          <div
            key={i}
            className="p-4 border rounded-lg shadow-sm bg-white text-center"
          >
            <h3 className="text-sm font-semibold text-gray-500 mb-1">
              {c.title}
            </h3>
            <p className="text-lg font-bold text-gray-800">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;

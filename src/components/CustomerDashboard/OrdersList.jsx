"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../supabaseClient";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        // 1. Get the signed-in user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("No user signed in");

        // 2. Check if this user exists in customers table
        const { data: customer, error: customerError } = await supabase
          .from("customers")
          .select("*")
          .eq("id", user.id)
          .single();

        if (customerError) throw customerError;
        if (!customer) throw new Error("Customer profile not found");

        // 3. Fetch orders for this customer
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_id", customer.id)
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;

        setOrders(ordersData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="p-2 border">{order.id.slice(0, 8)}...</td>
              <td className="p-2 border">{order.status}</td>
              <td className="p-2 border">
                {order.total_amount} {order.currency}
              </td>
              <td className="p-2 border">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => router.push(`/customer/dashboard/orders/${order.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersList;

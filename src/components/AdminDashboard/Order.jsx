"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "../../../supabaseClient";

const Order = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            id,
            status,
            total_amount,
            currency,
            created_at,
            customer_id,
            customers (
              full_name,
              email,
              profile_url
            )
          `
          )
          .order("created_at", { ascending: false });

        if (error) throw error;
        setActivities(data);
      } catch (err) {
        console.error("Error fetching activities:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const dispatchOrder = async (order) => {
    if (!order.id || !order.customer_id) return;
    try {
      const res = await fetch("/api/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.id,
          status: "dispatched",
          customer_id: order.customer_id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Order #${order.id} dispatched successfully!`);
        // update UI immediately
        setActivities((prev) =>
          prev.map((o) =>
            o.id === order.id ? { ...o, status: "dispatched" } : o
          )
        );
      } else {
        alert("Failed to dispatch order.");
      }
    } catch (err) {
      console.error("Error dispatching order:", err);
      alert("Error dispatching order");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Loading activities...</span>
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No recent activities found.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Email</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((order) => (
              <tr
                key={order.id}
                className="border-b hover:bg-gray-50 text-sm"
              >
                <td className="p-3 flex items-center gap-2">
                  <img
                    src={
                      order.customers?.profile_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        order.customers?.full_name || "User"
                      )}`
                    }
                    alt={order.customers?.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {order.customers?.full_name || "Unknown"}
                </td>
                <td className="p-3">{order.customers?.email}</td>
                <td className="p-3 font-medium">
                  {order.currency} {order.total_amount.toFixed(2)}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : order.status === "dispatched"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-red-100 text-red-600"
                      }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3 text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </td>
                <td className="p-3">
                  {order.status === "paid" && (
                    <button
                      onClick={() => dispatchOrder(order)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                    >
                      Dispatch
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {activities.map((order) => (
          <div
            key={order.id}
            className="p-4 border rounded-lg shadow-sm bg-white"
          >
            {/* Customer */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500">Customer</p>
              <div className="flex items-center gap-3 mt-1">
                <img
                  src={
                    order.customers?.profile_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      order.customers?.full_name || "User"
                    )}`
                  }
                  alt={order.customers?.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium">
                  {order.customers?.full_name || "Unknown"}
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500">Email</p>
              <p className="text-sm text-gray-700">{order.customers?.email}</p>
            </div>

            {/* Amount */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500">Amount</p>
              <p className="text-sm font-medium">
                {order.currency} {order.total_amount.toFixed(2)}
              </p>
            </div>

            {/* Status */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500">Status</p>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium inline-block
                  ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : order.status === "dispatched"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-green-100 text-green-800"
                  }`}
              >
                {order.status}
              </span>
            </div>

            {/* Date */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500">Date</p>
              <p className="text-xs text-gray-600">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            {/* Action Button */}
            {order.status === "paid" && (
              <button
                onClick={() => dispatchOrder(order)}
                className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm pointer"
              >
                Dispatch Order
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;

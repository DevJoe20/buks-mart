"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "../../../supabaseClient";
import { useRouter } from "next/navigation";

const DispatchButton = ({ order }) => {
  const [loading, setLoading] = useState(false);

  const dispatchOrder = async () => {
    setLoading(true);
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
        alert("Order dispatched successfully!");
      } else {
        alert("Failed to dispatch order.");
      }
    } catch (err) {
      console.error("Error dispatching order:", err);
      alert("Error dispatching order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={dispatchOrder}
      disabled={loading || order.status !== "paid"}
      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Dispatching..." : "Dispatch"}
    </button>
  );
};

// Confirm Delivery Button (Customer)
const ConfirmDeliveryButton = ({ order }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const confirmDelivery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.id,
          status: "completed",
          customer_id: order.customer_id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/success?orderId=${order.id}`);
      } else {
        alert("Failed to confirm delivery.");
      }
    } catch (err) {
      console.error("Error confirming delivery:", err);
      alert("Error confirming delivery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={confirmDelivery}
      disabled={loading || order.status !== "dispatched"}
      className="px-3 py-1 bg-[#A44A26] text-white rounded text-xs hover:bg-[#E08B68] disabled:opacity-50"
    >
      {loading ? "Confirming..." : "Confirm Delivery"}
    </button>
  );
};

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); 

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        // Get logged-in user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) {
          setActivities([]);
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setUserRole(profile?.role || "customer");

        // Fetch orders
        let query = supabase
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

        if (profile?.role !== "admin") {
          query = query.eq("customer_id", user.id);
        }

        const { data, error } = await query;
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
      <h2 className="text-xl font-semibold mb-4">My Recent Activities</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow bg-[#FAF8F4]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#A44A26] text-white text-sm">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Email</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
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
                          ? "bg-[#A44A26] text-white"
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
                  {userRole === "admin" ? (
                    <DispatchButton order={order} />
                  ) : (
                    <ConfirmDeliveryButton order={order} />
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
            <div className="items-center gap-3 mb-2">
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
              <div>
                <p className="font-medium">
                  {order.customers?.full_name || "Unknown"}
                </p>
                <p className="text-xs text-gray-500">
                  {order.customers?.email}
                </p>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="font-semibold">
                {order.currency} {order.total_amount.toFixed(2)}
              </span>
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
            </div>
            <p className="mt-2 text-xs text-gray-400">
              {new Date(order.created_at).toLocaleString()}
            </p>

            {/* Action Buttons */}
            <div className="mt-3">
              {userRole === "admin" ? (
                <DispatchButton order={order} />
              ) : (
                <ConfirmDeliveryButton order={order} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;

"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { supabase } from "../../../supabaseClient";

export default function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // ✅ Get logged in user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setOrders([]);
          setLoading(false);
          return;
        }

        // ✅ Fetch orders with items + product + product_images
        const { data, error } = await supabase
          .from("orders")
          .select(`
            id,
            status,
            total_amount,
            currency,
            created_at,
            order_items (
              id,
              quantity,
              unit_price,
              total_price,
              products (
                id,
                name,
                product_images (
                  image_url,
                  is_main
                )
              )
            )
          `)
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // ✅ Process data: find main or fallback image for each product
        const processed = data.map((order) => ({
          ...order,
          order_items: order.order_items.map((item) => {
            const images = item.products?.product_images || [];
            const mainImage =
              images.find((img) => img.is_main) || images[0];
            return {
              ...item,
              productImage: mainImage?.image_url || "/placeholder.png",
            };
          }),
        }));

        setOrders(processed);
      } catch (err) {
        console.error("Error fetching orders:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">No orders found</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>

      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-2 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-[#FAF8F4] shadow-md rounded-2xl p-4 border hover:shadow-lg transition"
          >
            <div className="mb-3">
              <h3 className="font-semibold text-lg">
                Order #{order.id.slice(0, 8)}
              </h3>
              <p className="text-sm text-gray-500">
                Placed on: {format(new Date(order.created_at), "PPpp")}
              </p>
              <p className="text-sm mt-1">
                Status:{" "}
                <span
                  className={`font-medium ${
                    order.status === "pending"
                      ? "text-yellow-600"
                      : order.status === "completed"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p className="font-medium">
                Total: {order.currency} {order.total_amount}
              </p>
            </div>

            <div className="divide-y">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2">
                  <img
                    src={item.productImage}
                    alt={item.products?.name}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.products?.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × {order.currency} {item.unit_price}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-700">
                    {order.currency} {item.total_price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="grid gap-4 md:hidden">
        {orders.map((order) => (
          <div key={order.id} className="bg-white shadow-sm rounded-xl p-3 border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-base">
                #{order.id.slice(0, 6)}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              Total: {order.currency} {order.total_amount}
            </p>
            <p className="text-gray-400 text-xs mb-2">
              {format(new Date(order.created_at), "PP")}
            </p>

            <div className="space-y-2">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <img
                    src={item.productImage}
                    alt={item.products?.name}
                    className="w-12 h-12 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.products?.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    {order.currency} {item.total_price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

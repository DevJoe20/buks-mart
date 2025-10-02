// app/success/SuccessContent.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "../context/CartContext"

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const { clearCart } = useCart();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!sessionId) {
          setError("Missing session ID.");
          setLoading(false);
          return;
        }

        console.log(
          "Fetching order for session:",
          sessionId,
          `(attempt ${retryCount + 1})`
        );

        const res = await fetch(`/api/order?session_id=${sessionId}`);
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 404 && retryCount < 10) {
            console.log("Order not found yet, retrying...");
            setTimeout(() => setRetryCount(prev => prev + 1), 2000);
            return;
          }
          throw new Error(data.error || `HTTP error! status: ${res.status}`);
        }

        setOrder(data);

        if (data.status === "paid") clearCart();

        if (data.status === "pending" && retryCount < 10) {
          setTimeout(() => setRetryCount(prev => prev + 1), 2000);
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching order:", err);

        if (retryCount < 10) {
          setTimeout(() => setRetryCount(prev => prev + 1), 2000);
        } else {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    if (sessionId) fetchOrder();
    else {
      setError("No session ID provided.");
      setLoading(false);
    }
  }, [sessionId, retryCount, clearCart]);

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Processing your payment...</p>
          <p className="mt-2 text-sm text-gray-500">
            {retryCount > 0
              ? `Checking payment status... (${retryCount}/10)`
              : "Confirming payment..."}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Session: {sessionId?.substring(0, 10)}...
          </p>
        </div>
      </div>
    );
  }

  // 🔹 Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-2xl font-bold text-red-600">
          Oops! Something went wrong
        </h1>
        <p className="mt-2 text-gray-600">{error}</p>
        <p className="mt-2 text-sm text-gray-500">
          Session ID: {sessionId || "Not provided"}
        </p>
        <div className="mt-6 space-x-4">
          <Link
            href="/cart-item"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Cart
          </Link>
          <Link
            href="/"
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // 🔹 Success state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-8">
      <div className="bg-green-100 text-green-600 p-3 rounded-full mb-4">
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="mt-2 text-gray-600">
        Thank you for your purchase. We're processing your order.
      </p>

      {order && (
        <div className="mt-6 bg-white border border-gray-200 p-6 rounded-lg shadow-md w-full max-w-md text-left">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Order Summary
          </h2>

          <div className="space-y-2">
            <p>
              <strong>Order ID:</strong> {order.id.slice(0, 8)}...
            </p>
            <p>
              <strong>Status:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  order.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status?.toUpperCase()}
              </span>
            </p>
            <p>
              <strong>Subtotal:</strong> £{order.subtotal?.toFixed(2)}
            </p>
            {order.delivery_fee > 0 && (
              <p>
                <strong>Delivery Fee:</strong> £
                {order.delivery_fee?.toFixed(2)}
              </p>
            )}
            <p className="border-t pt-2 font-semibold">
              <strong>Total:</strong> £{order.total_amount?.toFixed(2)}
            </p>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Items:</h3>
              <ul className="space-y-2">
                {order.items.map(item => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <span className="font-medium">{item.product_name}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        ×{item.quantity}
                      </span>
                    </div>
                    <span>£{item.total_price?.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-4 text-sm text-gray-500">
            Order placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="mt-8 space-y-4">
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Continue Shopping
        </Link>
        <Link
          href="/customer/dashboard/allorders"
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}

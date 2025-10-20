"use client";
import { formatDistanceToNow } from "date-fns";
import { Bell, Package, Truck, CheckCircle } from "lucide-react";
import { useNotifications } from "@/app/hooks/useNotifications";

export default function CustomerNotifications() {
  const { notifications, markAllAsRead, markAsRead } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case "order_placed":
        return <Package className="w-6 h-6 text-blue-600" />;
      case "order_dispatched":
        return <Truck className="w-6 h-6 text-yellow-600" />;
      case "order_delivered":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      default:
        return <Bell className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllAsRead}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications yet</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl shadow-md border bg-[#FAF8F4] transition cursor-pointer
                md:flex-row flex-col md:items-center md:text-left text-center
                ${n.read ? "hover:bg-gray-50" : "hover:bg-blue-50"}`}
            >
              {/* Icon */}
              <div className="flex-shrink-0">{getIcon(n.type)}</div>

              {/* Message & Time */}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    n.read ? "text-gray-600" : "text-gray-800"
                  }`}
                >
                  {n.message}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(n.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              {/* Badge */}
              <span
                className={`text-xs px-2 py-1 rounded-full mt-2 md:mt-0 ${
                  n.read
                    ? "bg-gray-200 text-gray-600"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {n.read ? "Read" : "New"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

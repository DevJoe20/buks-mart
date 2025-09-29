"use client";
import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/app/hooks/useNotifications"


export default function NotificationBell() {
  const { notifications, unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
          <div className="p-3 border-b font-semibold">Notifications</div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-3 text-gray-500">No notifications yet</p>
            ) : (
              <ul>
                {notifications.map((n) => (
                  <li key={n.id} className="p-3 border-b hover:bg-gray-50">
                    <p className="text-sm">{n.message}</p>
                    <small className="text-xs text-gray-400">
                      {new Date(n.created_at).toLocaleString()}
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ClipboardList, User } from "lucide-react";
import { supabase } from "../../../supabaseClient";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = 5;

  const fetchNotifications = async (pageNum = 1) => {
    setLoading(true);
    const from = (pageNum - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!error) {
      setNotifications(data || []);
      setTotalCount(count || 0);
    } else {
      console.error("Error fetching admin notifications:", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications(page);
    const channel = supabase
      .channel("notifications-admin")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        () => fetchNotifications(page)
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications" },
        () => fetchNotifications(page)
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [page]);

  const markAllAsRead = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("read", false);

    if (!error) fetchNotifications(page);
    setLoading(false);
  };

  const markAsRead = async (id) => {
    const target = notifications.find((n) => n.id === id);
    if (!target || target.read) return;
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    fetchNotifications(page);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Admin Notifications</h2>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllAsRead}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Mark all as read"}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications yet</p>
      ) : (
        <>
          {/* ✅ Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm">
                  <th className="p-3">Message</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((n) => (
                  <tr
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`border-b text-sm cursor-pointer ${
                      n.read ? "hover:bg-gray-50" : "hover:bg-blue-50"
                    }`}
                  >
                    <td className="p-3 flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-blue-600" />
                      {n.message}
                    </td>
                    <td className="p-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" />
                      {n.customer_name || n.customer_email || "Unknown"}
                    </td>
                    <td className="p-3 text-gray-500">
                      {formatDistanceToNow(new Date(n.created_at), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          n.read
                            ? "bg-gray-200 text-gray-600"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {n.read ? "Read" : "New"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Mobile Cards */}
          <div className="md:hidden space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`border rounded-lg p-4 shadow-sm cursor-pointer ${
                  n.read ? "bg-white hover:bg-gray-50" : "bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardList className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-medium">{n.message}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <User className="w-4 h-4" />
                  {n.customer_name || n.customer_email || "Unknown"}
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  {formatDistanceToNow(new Date(n.created_at), {
                    addSuffix: true,
                  })}
                </p>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
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
        </>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

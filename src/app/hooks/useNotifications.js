"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

export function useNotifications() {
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // ✅ Fetch current signed-in user
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Failed to fetch user:", error.message);
        return;
      }
      setUserId(user?.id || null);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    // 🔹 Fetch initial notifications
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error.message);
      } else {
        setNotifications(data || []);
      }
    };

    fetchNotifications();

    // 🔹 Realtime subscription
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`, // if needed, try user_id=eq."${userId}"
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => [payload.new, ...prev]);
          }
          if (payload.eventType === "UPDATE") {
            setNotifications((prev) =>
              prev.map((n) => (n.id === payload.new.id ? payload.new : n))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // 🔹 Mark all notifications as read
  const markAllAsRead = async () => {
    if (!userId) return;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // 🔹 Mark single notification as read
  const markAsRead = async (id) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return {
    userId,
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    markAllAsRead,
    markAsRead,
  };
}

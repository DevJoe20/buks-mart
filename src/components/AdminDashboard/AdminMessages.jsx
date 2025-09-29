"use client"
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

const AdminMessages = () => {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Track session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Check if user is admin + fetch messages
  useEffect(() => {
    if (!session) return;

    const checkAdminAndFetch = async () => {
      try {
        // 1️⃣ Check if user is admin
        const { data: admin, error: adminError } = await supabase
          .from("admins")
          .select("id")
          .eq("id", session.user.id)
          .single();

        if (adminError || !admin) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setIsAdmin(true);

        // 2️⃣ Fetch all contact messages with customer details
        const { data, error } = await supabase
          .from("contact_messages")
          .select(
            `
            id,
            message,
            created_at,
            customers (
              full_name,
              email,
              profile_url
            )
          `
          )
          .order("created_at", { ascending: false });

        if (error) throw error;

        setMessages(data);
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetch();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">You must be signed in to view this page.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Access denied. Admins only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2">
          📩 Contact Messages
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-200 text-left text-gray-600 uppercase text-xs md:text-sm">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No messages found.
                  </td>
                </tr>
              ) : (
                messages.map((msg, idx) => (
                  <tr
                    key={msg.id}
                    className={`border-b ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="py-3 px-4 font-medium">
                      {msg.customers.full_name}
                    </td>
                    <td className="py-3 px-4 text-blue-600">
                      {msg.customers.email}
                    </td>
                    <td className="py-3 px-4">{msg.message}</td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      {new Date(msg.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="grid gap-4 md:hidden sm:px-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages found.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                {/* Customer (with avatar) */}
                <div className="grid items-center gap-3 mb-3">
                  <img
                    src={
                      msg.customers?.profile_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        msg.customers?.full_name || "User"
                      )}`
                    }
                    alt={msg.customers?.full_name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Full Name</p>
                    <p className="text-sm font-medium">
                      {msg.customers.full_name}
                    </p>
                    <p className="text-xs font-semibold text-gray-500">Email</p>
                    <p className="text-xs text-blue-600">
                      {msg.customers.email}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-2">
                  <p className="text-xs font-semibold text-gray-500">
                    Message
                  </p>
                  <p className="text-sm text-gray-700">{msg.message}</p>
                </div>

                {/* Date */}
                <div>
                  <p className="text-xs font-semibold text-gray-500">Date</p>
                  <p className="text-xs text-gray-600">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;

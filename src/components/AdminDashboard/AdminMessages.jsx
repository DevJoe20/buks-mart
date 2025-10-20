"use client";
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

  // Check if user is admin + fetch inquiries
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

        // 2️⃣ Fetch all inquiries
        const { data, error } = await supabase
          .from("contact_inquiries")
          .select(
            `
            id,
            first_name,
            last_name,
            email,
            phone,
            subject,
            message,
            created_at
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
      <div className="max-w-6xl mx-auto bg-[#FAF8F4] shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2">
          📩 Contact Inquiries
        </h2>

        {/* Desktop Two-Column Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-200 text-left text-gray-600 uppercase text-xs md:text-sm">
                <th className="py-3 px-4 w-1/2">Contact Info</th>
                <th className="py-3 px-4 w-1/2">Inquiry Details</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-6 text-gray-500">
                    No inquiries found.
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
                    {/* Contact Info */}
                    <td className="py-4 px-4 align-top">
                      <p className="font-medium">
                        {msg.first_name} {msg.last_name || ""}
                      </p>
                      <p className="text-blue-600">{msg.email}</p>
                      {msg.phone && (
                        <p className="text-sm text-gray-600">{msg.phone}</p>
                      )}
                    </td>

                    {/* Inquiry Details */}
                    <td className="py-4 px-4 align-top">
                      {msg.subject && (
                        <p className="font-semibold text-gray-700 mb-1">
                          {msg.subject}
                        </p>
                      )}
                      <p className="text-gray-700 mb-2">{msg.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(msg.created_at).toLocaleString()}
                      </p>
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
            <p className="text-center text-gray-500">No inquiries found.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500">Name</p>
                  <p className="text-sm font-medium">
                    {msg.first_name} {msg.last_name || ""}
                  </p>
                  <p className="text-xs font-semibold text-gray-500">Email</p>
                  <p className="text-xs text-blue-600">{msg.email}</p>
                  {msg.phone && (
                    <>
                      <p className="text-xs font-semibold text-gray-500">
                        Phone
                      </p>
                      <p className="text-xs">{msg.phone}</p>
                    </>
                  )}
                </div>

                {msg.subject && (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-gray-500">
                      Subject
                    </p>
                    <p className="text-sm text-gray-700">{msg.subject}</p>
                  </div>
                )}

                <div className="mb-2">
                  <p className="text-xs font-semibold text-gray-500">Message</p>
                  <p className="text-sm text-gray-700">{msg.message}</p>
                </div>

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

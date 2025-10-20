"use client"
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      let { data, error } = await supabase
        .from("customers")
        .select("id, full_name, email, phone, status, profile_url, created_at");
      if (error) console.error(error);
      else setCustomers(data);
    };

    fetchCustomers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Customers</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#A44A26] text-white">
              <th className="p-2 border">Profile</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="p-2 border bg-[#FAF8F4]">
                  {c.profile_url ? (
                    <img
                      src={c.profile_url}
                      alt="profile"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-2 border bg-[#FAF8F4]">{c.full_name}</td>
                <td className="p-2 border bg-[#FAF8F4]">{c.email}</td>
                <td className="p-2 border bg-[#FAF8F4]">{c.phone || "N/A"}</td>
                <td className="p-2 border bg-[#FAF8F4]">{c.status}</td>
                <td className="p-2 border bg-[#FAF8F4]">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {customers.map((c) => (
          <div
            key={c.id}
            className="p-4 border rounded-lg shadow-sm bg-white"
          >
            {/* Profile */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500">Profile</p>
              {c.profile_url ? (
                <img
                  src={c.profile_url}
                  alt="profile"
                  className="w-12 h-12 rounded-full mt-1"
                />
              ) : (
                <p className="text-sm text-gray-600">N/A</p>
              )}
            </div>

            {/* Name */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500">Name</p>
              <p className="text-sm font-medium">{c.full_name}</p>
            </div>

            {/* Email */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500">Email</p>
              <p className="text-sm text-gray-700">{c.email}</p>
            </div>

            {/* Phone */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500">Phone</p>
              <p className="text-sm text-gray-700">{c.phone || "N/A"}</p>
            </div>

            {/* Status */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500">Status</p>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium inline-block
                  ${
                    c.status === "active"
                      ? "bg-green-100 text-green-600"
                      : c.status === "inactive"
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
              >
                {c.status}
              </span>
            </div>

            {/* Joined */}
            <div>
              <p className="text-xs font-semibold text-gray-500">Joined</p>
              <p className="text-xs text-gray-600">
                {new Date(c.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;

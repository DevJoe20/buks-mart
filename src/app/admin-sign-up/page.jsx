"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signUpUser } from "../../../auth";
import Link from "next/link";
import { supabase } from "../../../supabaseClient";

export default function AdminSignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [businessLogo, setBusinessLogo] = useState(null);
  const [businessName, setBusinessName] = useState("Buks Mart");

  // ✅ Fetch logo + business name from store_info
  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const { data, error } = await supabase
          .from("store_info")
          .select("business_logo, business_name")
          .limit(1)
          .single();

        if (error) throw error;

        if (data) {
          setBusinessLogo(data.business_logo);
          setBusinessName(data.business_name);
        }
      } catch (err) {
        console.error("Error fetching store info:", err.message);
      }
    };

    fetchStoreInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await signUpUser({
        email,
        password,
        full_name: fullName,
        role: "admin",
        admin_key: adminCode,
      });

      router.push("/sign-in");
    } catch (err) {
      setErrorMsg(err.message || "Failed to sign up. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full flex">
        {/* Left Side - Image */}
        <div className="hidden md:block w-1/2">
          <img
            src={businessLogo || "/placeholder-logo.png"}
            alt="Signup"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          {/* Logo + Heading */}
          <div className="mb-6">
            <img
              src={businessLogo || "/placeholder-logo.png"}
              alt={businessName}
              className="h-8 mb-4"
            />
            <h2 className="text-3xl font-serif mb-2">Create an Account</h2>
            <p className="text-sm text-gray-500">
              Register New {businessName} Admin Account
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Admin Code"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {errorMsg && (
              <p className="text-red-500 text-sm mb-4">{errorMsg}</p>
            )}

            <div className="flex justify-between items-center mb-6 text-sm">
              <span></span>
              <Link
                href="/forgot-password"
                className="text-gray-500 hover:text-black"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
            >
              {loading ? "Signing up..." : "SIGN UP AS ADMIN"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/sign-in"
              className="text-sm text-gray-500 hover:text-black"
            >
              SIGN IN TO ACCOUNT →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

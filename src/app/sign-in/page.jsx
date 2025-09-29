"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInUser } from "../../../auth"; // adjust path if needed
import { supabase } from "../../../supabaseClient";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [businessLogo, setBusinessLogo] = useState(null);
  const [businessName, setBusinessName] = useState("Buks Mart");

  // Fetch logo + business name from store_info
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

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const data = await signInUser({ email, password });
      const role = data.user?.user_metadata?.role;

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "customer") {
        router.push("/customer/dashboard");
      } else {
        setErrorMsg("User role not recognized.");
      }
    } catch (err) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl w-full">
        {/* Left image section */}
        <div className="w-1/2 hidden md:block">
          <img
            src={businessLogo || "/placeholder-logo.png"}
            alt="Sign In"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right form section */}
        <div className="w-full md:w-1/2 p-10">
          {/* Logo */}
          <div className="flex items-center mb-6">
            <img
              src={businessLogo || "/placeholder-logo.png"}
              alt={businessName}
              className="h-6 mr-2"
            />
            <span className="font-semibold text-gray-700">{businessName}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-semibold mb-2">Hello, Let's Sign In</h1>
          <p className="text-gray-500 text-sm mb-8">
            Please register or sign in.
          </p>

          {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

          <form onSubmit={handleSignIn}>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border rounded focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border rounded focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-900 transition-colors"
            >
              SIGN IN
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              href="/sign-up"
              className="text-sm text-gray-500 hover:underline"
            >
              CREATE AN ACCOUNT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

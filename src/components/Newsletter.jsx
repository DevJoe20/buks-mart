"use client";
import { useState } from "react";
import { Mail, User, Loader2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, full_name: fullName }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setEmail("");
        setFullName("");
        setIsError(false);
      } else {
        setIsError(true);
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-2xl border border-gray-100">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Subscribe to our Newsletter
      </h2>
      <p className="text-gray-500 text-sm mb-6 text-center">
        Stay updated with our latest news and offers.
      </p>

      <div className="max-w-lg mx-auto">
        {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Your Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 transition"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            "Subscribe"
          )}
        </button>
      </form>

      {/* Success / Error message */}
      {message && (
        <p
          className={`mt-4 text-sm text-center ${
            isError ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
      </div>
    </div>
  );
}

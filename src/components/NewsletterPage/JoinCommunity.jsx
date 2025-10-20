"use client";

import { useState } from "react";
import { supabase } from "../../../supabaseClient";
import { Gift, Sparkles, Heart, PartyPopper } from "lucide-react";

export default function JoinCommunity() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const options = [
    { text: "New product announcements and restocks", icon: Sparkles },
    { text: "Exclusive offers and limited-time deals", icon: Gift },
    { text: "Nostalgic Nigerian snacks and stories", icon: Heart },
    { text: "Community events and celebrations", icon: PartyPopper },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!fullName || !email) {
      setMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("subscribers").insert([
        {
          full_name: fullName,
          email: email,
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          setMessage("This email is already subscribed.");
        } else {
          throw error;
        }
      } else {
        setMessage("🎉 Thank you for joining our community!");
        setFullName("");
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="join-community" className="bg-[#FAF8F4] py-20 text-center">
      <div className="max-w-xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Join Our Community
        </h2>
        <p className="text-gray-700 font-semibold mb-8 text-sm md:text-base">
          Get exclusive access to new snack drops, special discounts,
          and nostalgic Nigerian favorites — all in one place.
        </p>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl p-6 sm:p-8 text-left"
        >
          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="Your first name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A4511F]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A4511F]"
              />
            </div>
          </div>

          {/* Benefits List with Lucide Icons */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              Become part of our growing family and enjoy these exclusive benefits:
            </p>
            <div className="space-y-2">
              {options.map(({ text, icon: Icon }) => (
                <div key={text} className="flex items-center gap-2 text-gray-700 text-sm">
                  <Icon size={16} className="text-[#A4511F]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A4511F] hover:bg-[#8c3f18] text-white py-2 rounded-md transition-colors duration-300 font-semibold text-sm"
          >
            {loading ? "Submitting..." : "Join Our Newsletter"}
          </button>

          {message && (
            <p className="mt-3 text-center text-sm text-gray-700">{message}</p>
          )}
        </form>
      </div>
    </section>
  );
}

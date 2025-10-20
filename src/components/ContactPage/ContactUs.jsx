"use client";

import { useState } from "react";
import { supabase } from "../../../supabaseClient";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    const { error } = await supabase.from("contact_inquiries").insert([formData]);

    if (error) {
      console.error("Error sending message:", error);
      setSuccess("❌ Failed to send message. Please try again.");
    } else {
      setSuccess("✅ Message sent successfully!");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }
    setLoading(false);
  };

  return (
    <section className="bg-[#FAF8F4] py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Contact Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6 text-[#3A1D0B]">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A4511F]"
                  placeholder="Your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A4511F]"
                  placeholder="Your last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A4511F]"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A4511F]"
                placeholder="+44 7XXX XXX XXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A4511F]"
                placeholder="What’s this about?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A4511F]"
                placeholder="Tell us how we can help you..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A4511F] hover:bg-[#8C3E18] text-white font-semibold py-2 rounded-md transition duration-300"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {success && (
              <p className="text-center text-sm font-medium mt-2">
                {success}
              </p>
            )}
          </form>
        </div>

        {/* Right: Contact Info */}
        <div>
          <h2 className="text-2xl font-bold text-[#3A1D0B] mb-4">Contact Information</h2>
          <p className="text-gray-700 mb-8">
            Reach out to us through any of these channels. We're here to help and ensure you
            have the best experience with our authentic Nigerian snacks.
          </p>

          <div className="space-y-5">
            {/* Address */}
            <div className="bg-white shadow-md rounded-xl p-5 flex items-start space-x-4 border-l-4 border-[#A4511F]">
              <MapPin className="text-[#A4511F] w-6 h-6 mt-1" />
              <div>
                <h3 className="font-bold text-[#3A1D0B]">Address</h3>
                <p className="text-sm text-gray-700">
                  123 Nigerian Food Street <br /> London, E1 6AN <br /> United Kingdom
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white shadow-md rounded-xl p-5 flex items-start space-x-4 border-l-4 border-[#A4511F]">
              <Phone className="text-[#A4511F] w-6 h-6 mt-1" />
              <div>
                <h3 className="font-bold text-[#3A1D0B]">Phone</h3>
                <p className="text-sm text-gray-700">+447895010343</p>
                <p className="text-sm text-gray-500">Monday - Friday: 9AM - 6PM</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white shadow-md rounded-xl p-5 flex items-start space-x-4 border-l-4 border-[#A4511F]">
              <Mail className="text-[#A4511F] w-6 h-6 mt-1" />
              <div>
                <h3 className="font-bold text-[#3A1D0B]">Email</h3>
                <p className="text-sm text-gray-700">martbuks@gmail.com</p>
                <p className="text-sm text-gray-700">martbuks@gmail.com</p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white shadow-md rounded-xl p-5 flex items-start space-x-4 border-l-4 border-[#A4511F]">
              <Clock className="text-[#A4511F] w-6 h-6 mt-1" />
              <div>
                <h3 className="font-bold text-[#3A1D0B]">Business Hours</h3>
                <p className="text-sm text-gray-700">
                  Monday - Friday: 9:00 AM - 6:00 PM <br />
                  Saturday: 10:00 AM - 4:00 PM <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

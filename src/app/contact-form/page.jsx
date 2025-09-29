"use client"
import { useState, useEffect, useRef } from "react";
import emailjs from "emailjs-com";
import { supabase } from "../../../supabaseClient";


const ContactForm = () => {
  const form = useRef();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  // Track login state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const sendEmail = async (e) => {
    e.preventDefault();
    if (!session) {
      alert("You must be signed in to submit this form.");
      return;
    }

    setLoading(true);

    const formData = new FormData(form.current);
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const message = formData.get("message");

    try {
      // 1️⃣ Get customer record
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("id")
        .eq("id", session.user.id)
        .single();

      if (customerError || !customer) {
        throw new Error("Customer record not found");
      }

      // 2️⃣ Store message in Supabase with customer_id
      const { error: dbError } = await supabase.from("contact_messages").insert([
        {
          user_id: session.user.id,
          customer_id: customer.id,
          phone: phone,
          message: message,
        },
      ]);

      if (dbError) throw dbError;

      // 3️⃣ Send to admin inbox via EmailJS
      await emailjs.send(
        "service_rrijgdd",
        "template_apym4ba",
        {
          from_name: name,
          from_email: email,
          // phone: phone,
          message: message,
        },
        "ZKnQ2hjC5a_I2b7Oj"
      );

      alert("Message sent successfully ✅");
      form.current.reset();
    } catch (error) {
      console.error(error);
      alert("Failed to send message ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <form
        ref={form}
        onSubmit={sendEmail}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl space-y-6"
      >
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Contact Us</h2>
          <p className="text-gray-600 mt-1 text-sm">
            We love hearing from you, our Shop customers. <br />
            Please contact us and we will make sure to get back to you as soon as we possibly can.
          </p>
        </div>

        {/* Name & Email in grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Your Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Phone */}
        {/* <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Your Phone Number
          </label>
          <input
            type="text"
            name="phone"
            placeholder="Your Phone"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div> */}

        {/* Message */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            What's on your mind? <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            placeholder="Jot us a note and we'll get back to you as quickly as possible"
            required
            rows="5"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !session}
          className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
            session
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          {loading ? "Sending..." : session ? "Submit" : "Sign in to send"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;

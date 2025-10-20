"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

export default function FrequentQuestions() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("faqs")
      .select("id, question, answer")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching FAQs:", error);
    } else {
      setFaqs(data);
    }
    setLoading(false);
  };

  return (
    <section className="bg-[#FAF8F4] py-16 px-6 md:px-10 lg:px-12">
      {/* Header */}
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          Quick answers to common questions about our snacks, delivery, and
          services.
        </p>
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {loading ? (
          // 🔄 Skeleton loading cards
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 animate-pulse"
            >
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))
        ) : faqs.length > 0 ? (
          // ✅ Loaded FAQs
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-all duration-300"
            >
              <h3 className="font-semibold text-lg text-[#1a1a1a] mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))
        ) : (
          //  Empty state
          <div className="col-span-2 text-center text-gray-500">
            No FAQs available yet.
          </div>
        )}
      </div>
    </section>
  );
}

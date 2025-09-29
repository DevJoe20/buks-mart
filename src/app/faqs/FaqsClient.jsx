"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "../../../supabaseClient";

export default function FaqsClient({ initialFaqs, totalCount, pageSize }) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    if (page === 1) return; 

    const fetchFaqs = async () => {
      setLoading(true);
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await supabase
        .from("faqs")
        .select("id, question, answer")
        .order("created_at", { ascending: true })
        .range(from, to);

      if (error) {
        console.error("Error fetching FAQs:", error.message);
      } else {
        setFaqs(data || []);
      }
      setLoading(false);
    };

    fetchFaqs();
  }, [page, pageSize]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading FAQs...</p>
      ) : faqs.length === 0 ? (
        <p className="text-center text-gray-500">
          No FAQs available at the moment.
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="border rounded-2xl shadow-sm bg-white">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-4 text-left"
                >
                  <span className="font-medium text-gray-800">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {openIndex === index && (
                  <div className="px-4 pb-4 text-gray-600 text-sm md:text-base">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-2 mt-6 flex-wrap">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${
                page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded ${
                  page === p
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
              className={`px-3 py-1 rounded ${
                page === totalPages || totalPages === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

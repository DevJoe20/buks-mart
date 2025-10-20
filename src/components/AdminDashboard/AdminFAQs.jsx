"use client"
import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { supabase } from "../../../supabaseClient";

const AdminFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState(null);
  const [form, setForm] = useState({ question: "", answer: "" });
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = 5; // FAQs per page

  useEffect(() => {
    fetchFaqs();
  }, [page]);

  const fetchFaqs = async () => {
    setLoading(true);

    // Get total count
    const { count } = await supabase
      .from("faqs")
      .select("id", { count: "exact", head: true });

    setTotalCount(count || 0);

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!error) setFaqs(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingFaq) {
      const { error } = await supabase
        .from("faqs")
        .update({ question: form.question, answer: form.answer })
        .eq("id", editingFaq.id);

      if (!error) {
        setEditingFaq(null);
        setForm({ question: "", answer: "" });
        fetchFaqs();
      }
    } else {
      const { error } = await supabase.from("faqs").insert([form]);
      if (!error) {
        setForm({ question: "", answer: "" });
        fetchFaqs();
      }
    }
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setForm({ question: faq.question, answer: faq.answer });
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (!error) fetchFaqs();
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Manage FAQs</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          type="text"
          placeholder="Enter question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Enter answer"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
          className="w-full border p-2 rounded h-24"
          required
        />
        <button
          type="submit"
          className="bg-[#A4511F] text-white px-4 py-2 rounded shadow hover:bg-[#B85F3A]"
        >
          {editingFaq ? "Update FAQ" : "Add FAQ"}
        </button>
        {editingFaq && (
          <button
            type="button"
            onClick={() => {
              setEditingFaq(null);
              setForm({ question: "", answer: "" });
            }}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded shadow hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </form>

      {/* FAQ List */}
      {loading ? (
        <p>Loading FAQs...</p>
      ) : (
        <>
          {/* Desktop List */}
          <div className="hidden md:block space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{faq.question}</p>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <div className="mb-2">
                  <p className="text-xs text-gray-500 font-semibold">Question</p>
                  <p className="font-medium">{faq.question}</p>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-gray-500 font-semibold">Answer</p>
                  <p className="text-sm text-gray-700">{faq.answer}</p>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 flex items-center gap-1"
                  >
                    <FiEdit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 flex items-center gap-1"
                  >
                    <FiTrash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
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
};

export default AdminFAQs;

"use client"
import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { supabase } from "../../../supabaseClient";

const AdminTerms = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTerm, setEditingTerm] = useState(null);
  const [form, setForm] = useState({ section: "", content: "" });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTerms, setTotalTerms] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    fetchTerms();
  }, [currentPage]);

  const fetchTerms = async () => {
    setLoading(true);

    // Count total rows
    const { count } = await supabase
      .from("terms")
      .select("*", { count: "exact", head: true });

    setTotalTerms(count || 0);

    // Fetch paginated rows
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("terms")
      .select("*")
      .order("created_at", { ascending: true })
      .range(from, to);

    if (!error) setTerms(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingTerm) {
      const { error } = await supabase
        .from("terms")
        .update({
          section: form.section,
          content: form.content,
        })
        .eq("id", editingTerm.id);

      if (!error) {
        setEditingTerm(null);
        setForm({ section: "", content: "" });
        fetchTerms();
      }
    } else {
      const { error } = await supabase.from("terms").insert([form]);
      if (!error) {
        setForm({ section: "", content: "" });
        fetchTerms();
      }
    }
  };

  const handleEdit = (term) => {
    setEditingTerm(term);
    setForm({ section: term.section, content: term.content });
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("terms").delete().eq("id", id);
    if (!error) fetchTerms();
  };

  const totalPages = Math.ceil(totalTerms / pageSize);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Manage Terms & Conditions</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          type="text"
          placeholder="Enter section title (e.g., 'Eligibility')"
          value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Enter section content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full border p-2 rounded h-40"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 mb-4"
        >
          {editingTerm ? "Update Section" : "Add Section"}
        </button>
        {editingTerm && (
          <button
            type="button"
            onClick={() => {
              setEditingTerm(null);
              setForm({ section: "", content: "" });
            }}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded shadow hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Terms List */}
      {loading ? (
        <p>Loading terms...</p>
      ) : terms.length === 0 ? (
        <p>No terms found.</p>
      ) : (
        <>
          {/* Desktop List */}
          <div className="hidden md:block space-y-8">
            {terms.map((term) => (
              <div
                key={term.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{term.section}</h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {term.content}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(term)}
                      className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(term.id)}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {terms.map((term) => (
              <div
                key={term.id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <div className="mb-3">
                  <p className="text-xs text-gray-500 font-semibold">Section</p>
                  <h3 className="font-medium text-lg">{term.section}</h3>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-gray-500 font-semibold">Content</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {term.content}
                  </p>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(term)}
                    className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 flex items-center gap-1"
                  >
                    <FiEdit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(term.id)}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 flex items-center gap-1"
                  >
                    <FiTrash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2 flex-wrap">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTerms;

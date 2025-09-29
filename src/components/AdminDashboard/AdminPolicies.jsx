"use client"
import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { supabase } from "../../../supabaseClient";

const AdminPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [form, setForm] = useState({ section: "", content: "" });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPolicies, setTotalPolicies] = useState(0);
  const pageSize = 5; // rows per page

  useEffect(() => {
    fetchPolicies();
  }, [currentPage]);

  const fetchPolicies = async () => {
    setLoading(true);

    // Count total rows
    const { count } = await supabase
      .from("return_policy")
      .select("*", { count: "exact", head: true });

    setTotalPolicies(count || 0);

    // Fetch paginated rows
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("return_policy")
      .select("*")
      .order("created_at", { ascending: true }) // oldest first
      .range(from, to);

    if (!error) setPolicies(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingPolicy) {
      const { error } = await supabase
        .from("return_policy")
        .update({
          section: form.section,
          content: form.content,
        })
        .eq("id", editingPolicy.id);

      if (!error) {
        setEditingPolicy(null);
        setForm({ section: "", content: "" });
        fetchPolicies();
      }
    } else {
      const { error } = await supabase.from("return_policy").insert([form]);
      if (!error) {
        setForm({ section: "", content: "" });
        fetchPolicies();
      }
    }
  };

  const handleEdit = (policy) => {
    setEditingPolicy(policy);
    setForm({ section: policy.section, content: policy.content });
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("return_policy").delete().eq("id", id);
    if (!error) fetchPolicies();
  };

  const totalPages = Math.ceil(totalPolicies / pageSize);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Manage Return Policy</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          type="text"
          placeholder="Enter section title (e.g., 'Refunds')"
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
          {editingPolicy ? "Update Section" : "Add Section"}
        </button>
        {editingPolicy && (
          <button
            type="button"
            onClick={() => {
              setEditingPolicy(null);
              setForm({ section: "", content: "" });
            }}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded shadow hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Policy List */}
      {loading ? (
        <p>Loading return policy...</p>
      ) : policies.length === 0 ? (
        <p>No return policy sections found.</p>
      ) : (
        <>
          {/* Desktop List */}
          <div className="hidden md:block space-y-8 ">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{policy.section}</h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {policy.content}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(policy)}
                      className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(policy.id)}
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
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <div className="mb-3">
                  <p className="text-xs text-gray-500 font-semibold">Section</p>
                  <h3 className="font-medium text-lg">{policy.section}</h3>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-gray-500 font-semibold">Content</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {policy.content}
                  </p>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(policy)}
                    className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 flex items-center gap-1"
                  >
                    <FiEdit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(policy.id)}
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

export default AdminPolicies;

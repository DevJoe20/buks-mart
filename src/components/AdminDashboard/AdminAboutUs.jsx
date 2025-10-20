"use client"
import { useEffect, useState } from "react";
import { InfoIcon } from "lucide-react";
import { toast } from "react-toastify";
import { supabase } from "../../../supabaseClient";

const AdminAboutUs = () => {
  const [aboutUs, setAboutUs] = useState("");
  const [storeId, setStoreId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("store_info")
        .select("id, about_us")
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching About Us:", error.message);
        toast.error("Failed to fetch About Us text.");
      } else {
        setStoreId(data.id);
        setAboutUs(data.about_us || "");
      }

      setLoading(false);
    };

    fetchStoreInfo();
  }, []);

  const handleSave = async () => {
    if (!storeId) {
      toast.error("No store record found.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("store_info")
      .update({ about_us: aboutUs })
      .eq("id", storeId);

    if (error) {
      console.error("Error updating About Us:", error.message);
      toast.error("Failed to update About Us.");
    } else {
      toast.success("About Us updated successfully!");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Loading About Us...</div>
    );
  }

  return (
    <div className="w-full px-4 md:px-12 lg:px-20 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Desktop / Tablet */}
        <div className="hidden md:block bg-[#FAF8F4] shadow rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <InfoIcon className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Manage About Us</h1>
          </div>

          <label className="block text-gray-700 font-medium mb-2">
            About Us Text
          </label>
          <textarea
            rows={10}
            value={aboutUs}
            onChange={(e) => setAboutUs(e.target.value)}
            placeholder="Write your About Us description here..."
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2 rounded-lg text-white shadow ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#A4511F] hover:bg-[#B85F3A]"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Mobile Card */}
        <div className="md:hidden bg-[#FAF8F4] shadow rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <InfoIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Manage About Us
            </h2>
          </div>

          <div className="mb-3">
            <p className="text-xs text-gray-500 font-medium mb-1">About Us</p>
            <textarea
              rows={6}
              value={aboutUs}
              onChange={(e) => setAboutUs(e.target.value)}
              placeholder="Write your About Us..."
              className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-2 rounded-lg text-white text-sm shadow ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#A4511F] hover:bg-[#B85F3A]"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAboutUs;

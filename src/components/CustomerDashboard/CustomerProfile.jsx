"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    gender: "",
    dob: "",
    profile_url: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setProfile(data);
        setFormData({
          phone: data.phone || "",
          gender: data.gender || "",
          dob: data.dob || "",
          profile_url: data.profile_url || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("icons")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("icons").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      setFormData((prev) => ({ ...prev, profile_url: publicUrl }));
    } catch (err) {
      console.error("Error uploading file:", err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("customers")
        .update({
          phone: formData.phone,
          gender: formData.gender,
          dob: formData.dob,
          profile_url: formData.profile_url,
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile({ ...profile, ...formData });
      setOpen(false);
    } catch (err) {
      console.error("Error updating profile:", err.message);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="text-center text-red-500">No profile found.</p>;
  }

  return (
    <div className="w-full space-y-6 py-8 lg:px-12">
      {/* Responsive Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Overview Card */}
        <div className="bg-[#FAF8F4] shadow-lg rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-6">
          <div className="items-center gap-6">
            <div className="w-24 h-24 rounded-full border overflow-hidden">
              <img
                src={profile.profile_url || "https://via.placeholder.com/150"}
                alt={profile.full_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profile.full_name}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                  profile.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {profile.status}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                Member since {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-[#A44A26] text-white rounded-lg hover:bg-[#C86A46] transition w-full sm:w-auto"
          >
            Edit Profile
          </button>
        </div>

        {/* Personal Details Card */}
        <div className="bg-[#FAF8F4] shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3">Personal Details</h3>
          <div className="grid gap-4 text-gray-700">
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {profile.phone || "Not provided"}
            </p>
            <p>
              <span className="font-medium">Gender:</span>{" "}
              {profile.gender || "Not specified"}
            </p>
            <p>
              <span className="font-medium">Date of Birth:</span>{" "}
              {profile.dob || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                />
              </div>

              {/* Profile Picture Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="w-full border rounded-md p-2"
                />
                {uploading && (
                  <p className="text-sm text-gray-500">Uploading...</p>
                )}
                {formData.profile_url && (
                  <img
                    src={formData.profile_url}
                    alt="Preview"
                    className="w-16 h-16 rounded-full mt-2 object-cover border"
                  />
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-[#A44A26] text-white rounded-lg hover:bg-[#C86A46] transition"
                >
                  {uploading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;

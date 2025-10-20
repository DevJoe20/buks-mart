"use client"
import { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";

const Settings = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [profilePic, setProfilePic] = useState(null); // for new upload
  const [profileUrl, setProfileUrl] = useState(""); // display current pic
  const [oldFilePath, setOldFilePath] = useState(""); // keep old file path

  // Change password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("admins")
        .select("full_name, phone_number, profile_picture")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setFullName(data.full_name);
        setPhone(data.phone_number || "");
        if (data.profile_picture) {
          setOldFilePath(data.profile_picture);
          const { data: publicUrl } = supabase.storage
            .from("icons")
            .getPublicUrl(data.profile_picture);
          setProfileUrl(publicUrl.publicUrl);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    let uploadedFilePath = null;

    if (profilePic) {
      const fileExt = profilePic.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      if (oldFilePath) {
        await supabase.storage.from("icons").remove([oldFilePath]);
      }

      const { error: uploadError } = await supabase.storage
        .from("icons")
        .upload(filePath, profilePic, { upsert: true });

      if (uploadError) {
        setMessage(uploadError.message);
        return;
      }

      uploadedFilePath = filePath;
    }

    const { error } = await supabase
      .from("admins")
      .update({
        full_name: fullName,
        phone_number: phone,
        ...(uploadedFilePath && { profile_picture: uploadedFilePath }),
      })
      .eq("id", user.id);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Profile updated successfully!");
      if (uploadedFilePath) {
        const { data: publicUrl } = supabase.storage
          .from("icons")
          .getPublicUrl(uploadedFilePath);
        setProfileUrl(publicUrl.publicUrl);
        setOldFilePath(uploadedFilePath);
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      {/* Profile Update */}
      <div className="mb-10">
        {/* Desktop */}
        <div className="hidden md:block">
          <h2 className="text-xl font-medium mb-4">Profile</h2>
          {profileUrl && (
            <div className="mb-4">
              <img
                src={profileUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          )}
          <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-[#A4511F] text-white px-4 py-2 rounded hover:bg-[#B85F3A] mb-4"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Mobile Card */}
        <div className="md:hidden bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Profile</h2>
          {profileUrl && (
            <div className="flex justify-center mb-4">
              <img
                src={profileUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
          )}
          <form onSubmit={handleProfileUpdate} className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border rounded text-sm"
            />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded text-sm"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="w-full p-2 border rounded text-sm"
            />
            <button
              type="submit"
              className="w-full bg-[#A4511F] text-white py-2 rounded hover:bg-[#B85F3A] text-sm"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>

      {/* Change Password */}
      <div>
        {/* Desktop */}
        <div className="hidden md:block">
          <h2 className="text-xl font-medium mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Change Password
            </button>
          </form>
        </div>

        {/* Mobile Card */}
        <div className="md:hidden bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded text-sm"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded text-sm"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded text-sm"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>

      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
    </div>
  );
};

export default Settings;

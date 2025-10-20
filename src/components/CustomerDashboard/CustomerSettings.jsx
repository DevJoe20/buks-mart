"use client"
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

const CustomerSettings = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserAndSettings = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        setUser(user);

        const { data, error } = await supabase
          .from("customers")
          .select("email_notifications, sms_notifications")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setSettings({
          email_notifications: data?.email_notifications ?? true,
          sms_notifications: data?.sms_notifications ?? false,
        });
      } catch (err) {
        console.error("Error fetching settings:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndSettings();
  }, []);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from("customers")
        .update(settings)
        .eq("id", user.id);

      if (error) throw error;
    } catch (err) {
      console.error("Error saving settings:", err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      if (!user?.email) return;
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: "http://localhost:5173/reset-password", 
      });
      if (error) throw error;
      alert("Password reset email sent!");
    } catch (err) {
      console.error("Error resetting password:", err.message);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to permanently delete your account? This cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from("customers").delete().eq("id", user.id);
      if (error) throw error;

      await supabase.auth.signOut();
      alert("Your account has been deleted.");
      window.location.href = "/";
    } catch (err) {
      console.error("Error deleting account:", err.message);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading settings...</p>;
  }

  if (!user) {
    return <p className="text-center text-red-500">No user logged in.</p>;
  }

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Account Info */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        <p className="mb-2">
          <span className="font-medium">Email:</span> {user.email}
        </p>
        <button
          onClick={handlePasswordReset}
          className="px-4 py-2 bg-[#A44A26] text-white rounded-lg hover:bg-[#C86A46] transition"
        >
          Reset Password
        </button>
      </div>

      {/* Notification Preferences */}
      {/* <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="email_notifications"
              checked={settings.email_notifications}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span>Email Notifications</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="sms_notifications"
              checked={settings.sms_notifications}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span>SMS Notifications</span>
          </label>
        </div>
        <button
          onClick={handleSave}
          disabled={updating}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {updating ? "Saving..." : "Save Preferences"}
        </button>
      </div> */}

      {/* Danger Zone */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default CustomerSettings;

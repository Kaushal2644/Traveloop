import { useState, useEffect } from "react";
import { User, Mail, Globe, Save, LogOut, Map, CheckCircle, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const LANGUAGES = ["English", "Hindi", "Gujarati", "Marathi", "Tamil", "Telugu", "Kannada", "Bengali", "Punjabi"];

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", language: "English" });
  const [stats, setStats] = useState({ total: 0, completed: 0, shared: 0 });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        language: user.language || "English",
      });
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await api.get("/trips");
      const trips = res.data || [];
      setStats({
        total: trips.length,
        completed: trips.filter(t => t.status === "completed").length,
        shared: trips.filter(t => t.isPublic).length,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
  setError("");
  if (!form.name.trim()) return setError("Name is required.");
  try {
    setSaving(true);
    const res = await api.put("/auth/profile/update", { name: form.name, language: form.language });
    updateUser({ ...user, name: form.name, language: form.language });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to save.");
  } finally {
    setSaving(false);
  }
};

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = form.name
    ? form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F5F0" }}>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile & Settings</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: "#2A9D8F" }}
            >
              {initials}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{form.name}</p>
              <p className="text-sm text-gray-400">{form.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <User size={14} className="text-gray-400" /> Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition"
                style={{ "--tw-ring-color": "#2A9D8F" }}
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Mail size={14} className="text-gray-400" /> Email
              </label>
              <input
                type="email"
                value={form.email}
                readOnly
                className="w-full px-3 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Globe size={14} className="text-gray-400" /> Language Preference
              </label>
              <select
                value={form.language}
                onChange={e => setForm({ ...form, language: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition"
              >
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg border border-red-100">{error}</div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition"
              style={{ backgroundColor: saved ? "#16a34a" : "#2A9D8F" }}
            >
              {saved ? (
                <><CheckCircle size={15} /> Saved!</>
              ) : saving ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
              ) : (
                <><Save size={15} /> Save Preferences</>
              )}
            </button>
          </div>
        </div>

        {/* Trip Stats */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4 text-sm">Trip Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Trips", value: stats.total, icon: Map, color: "text-teal-600" },
              { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-green-600" },
              { label: "Shared", value: stats.shared, icon: Share2, color: "text-orange-500" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="text-center">
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-gray-400 mt-0.5 flex items-center justify-center gap-1">
                  <Icon size={10} /> {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 text-red-500 hover:bg-red-50 transition text-sm font-medium"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
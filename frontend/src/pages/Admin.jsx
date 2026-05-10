import { useState, useEffect } from "react";
import { Users, Map, MapPin, Activity, Shield } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import api from "../api/axios";

const COLORS = ["#2A9D8F", "#E76F51", "#E9C46A", "#264653", "#F4A261"];

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchAdmin(); }, []);

  const fetchAdmin = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Access denied or failed to load.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#F5F5F0" }}>
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-500 border-t-transparent" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: "#F5F5F0" }}>
      <Shield size={40} className="text-gray-300 mb-3" />
      <p className="text-gray-500 text-sm">{error}</p>
    </div>
  );

  // Build chart data from stats
  const cityData = stats?.topCities?.map(c => ({ name: c._id || c.city || c.name, count: c.count })) || [];
  const activityData = stats?.activityCategories?.map(a => ({ name: a._id || a.category || a.name, value: a.count })) || [];

  const statCards = [
    { label: "Users", value: stats?.totalUsers ?? users.length, icon: Users, color: "#2A9D8F" },
    { label: "Trips", value: stats?.totalTrips ?? 0, icon: Map, color: "#E76F51" },
    { label: "Stops", value: stats?.totalStops ?? 0, icon: MapPin, color: "#E9C46A" },
    { label: "Activities", value: stats?.totalActivities ?? 0, icon: Activity, color: "#264653" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F5F0" }}>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Shield size={20} className="text-teal-500" />
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Top Cities Bar Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">Top Cities</h2>
            {cityData.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-gray-300 text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={cityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #f3f4f6" }}
                    cursor={{ fill: "#f0fdf9" }}
                  />
                  <Bar dataKey="count" fill="#2A9D8F" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Activity Categories Pie Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">Activity Categories</h2>
            {activityData.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-gray-300 text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={activityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {activityData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Users Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Recent Users</h2>
          </div>
          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No users found.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {users.map((u) => (
                <div key={u._id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: "#2A9D8F" }}
                    >
                      {u.name ? u.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    u.role === "admin"
                      ? "bg-teal-50 text-teal-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {u.role || "user"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
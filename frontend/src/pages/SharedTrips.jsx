import { useState, useEffect } from "react";
import { Globe, Calendar, MapPin, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function SharedTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => { fetchShared(); }, []);

  const fetchShared = async () => {
    try {
      setLoading(true);
      const res = await api.get("/trips/public");
      setTrips(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = trips.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#F5F5F0" }}>
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F5F0" }}>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Shared Itineraries</h1>
          <p className="text-sm text-gray-500 mt-1">Get inspired by trips shared by the community</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search shared trips..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 transition"
            style={{ focusRingColor: "#2A9D8F" }}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Globe size={40} className="mb-3 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">No shared trips yet</p>
            <p className="text-xs mt-1">Be the first to share your itinerary!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((trip) => (
              <div key={trip._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Cover */}
                <div
                  className="h-36 flex items-center justify-center relative"
                  style={{
                    background: trip.coverPhoto
                      ? `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url(${trip.coverPhoto}) center/cover`
                      : "linear-gradient(135deg, #e8f5f3 0%, #fef3ee 100%)",
                  }}
                >
                  <span className="absolute top-3 right-3 bg-teal-500 text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    <Globe size={10} /> Public
                  </span>
                  {!trip.coverPhoto && <Globe size={28} className="text-teal-300" />}
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{trip.name}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                    <Calendar size={10} />
                    {new Date(trip.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    {" – "}
                    {new Date(trip.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  {trip.description && (
                    <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{trip.description}</p>
                  )}
                  <button
                    onClick={() => navigate(`/trips/${trip._id}`)}
                    className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium transition"
                  >
                    View itinerary <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
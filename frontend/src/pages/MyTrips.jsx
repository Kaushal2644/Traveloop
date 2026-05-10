import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { MapPin, Calendar, Plus, Search, MoreVertical, Pencil, Trash2 } from "lucide-react";

const STATUS_COLORS = {
  planning: "bg-gray-100 text-gray-600",
  upcoming: "bg-teal-50 text-[#2A9D8F]",
  ongoing: "bg-blue-50 text-blue-600",
  completed: "bg-green-50 text-green-600",
};

const TripCard = ({ trip, onDelete, onClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const start = new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const end = new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow relative"
    >
      {/* Image area */}
      <div className="h-40 bg-gradient-to-br from-teal-50 via-white to-orange-50 relative flex items-center justify-center">
        <span
          className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${
            STATUS_COLORS[trip.status] || STATUS_COLORS.planning
          }`}
        >
          {trip.status}
        </span>

        {/* Three-dot menu */}
        <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition"
          >
            <MoreVertical size={14} className="text-gray-500" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 bg-white border border-gray-100 rounded-xl shadow-lg z-10 w-36 py-1">
              <button
                onClick={() => { setMenuOpen(false); navigate(`/trips/${trip._id}`); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                onClick={() => { setMenuOpen(false); onDelete(trip._id); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>

        <MapPin size={28} className="text-[#2A9D8F]/30" />
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-semibold text-[#1a1a1a] text-base mb-2">{trip.name}</h3>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
          <Calendar size={12} />
          <span>{start} – {end}</span>
        </div>
        {trip.description && (
          <p className="text-gray-400 text-xs mt-1 line-clamp-2">{trip.description}</p>
        )}
      </div>
    </div>
  );
};

const MyTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(trips);
    } else {
      setFiltered(
        trips.filter((t) =>
          t.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, trips]);

  const fetchTrips = async () => {
    try {
      const { data } = await API.get("/trips");
      setTrips(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this trip? This cannot be undone.")) return;
    try {
      await API.delete(`/trips/${id}`);
      setTrips((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert("Failed to delete trip.");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">My Trips</h1>
        <button
          onClick={() => navigate("/trips/new")}
          className="flex items-center gap-2 bg-[#2A9D8F] hover:bg-[#238b7e] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
        >
          <Plus size={16} />
          New Trip
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search trips..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/30 focus:border-[#2A9D8F] transition bg-white"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 h-56 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <MapPin size={36} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm mb-4">
            {search ? "No trips match your search." : "You haven't created any trips yet."}
          </p>
          {!search && (
            <button
              onClick={() => navigate("/trips/new")}
              className="text-sm text-[#2A9D8F] font-medium hover:underline"
            >
              Plan your first trip →
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onDelete={handleDelete}
              onClick={() => navigate(`/trips/${trip._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;
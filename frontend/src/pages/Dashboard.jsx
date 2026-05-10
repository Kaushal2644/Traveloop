import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { MapPin, Calendar, PlusCircle } from "lucide-react";

const STATUS_COLORS = {
  planning: "bg-gray-100 text-gray-600",
  upcoming: "bg-teal-50 text-[#2A9D8F]",
  ongoing: "bg-blue-50 text-blue-600",
  completed: "bg-green-50 text-green-600",
};

const RECOMMENDED = [
  { name: "Tokyo", country: "Japan", category: "CULTURE", gradient: "from-pink-200 to-orange-100" },
  { name: "Paris", country: "France", category: "ROMANCE", gradient: "from-blue-200 to-purple-100" },
  { name: "Bali", country: "Indonesia", category: "NATURE", gradient: "from-green-200 to-teal-100" },
  { name: "New York", country: "USA", category: "CITY", gradient: "from-gray-200 to-slate-100" },
];

const TripCard = ({ trip, onClick }) => {
  const start = new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const end = new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Card image area */}
      <div className="h-36 bg-gradient-to-br from-teal-50 via-white to-orange-50 relative flex items-center justify-center">
        <span
          className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${
            STATUS_COLORS[trip.status] || STATUS_COLORS.planning
          }`}
        >
          {trip.status}
        </span>
        <MapPin size={28} className="text-[#2A9D8F]/30" />
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="font-semibold text-[#1a1a1a] text-base mb-2">{trip.name}</h3>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
          <Calendar size={12} />
          <span>{start} – {end}</span>
        </div>
        {trip.budget > 0 && (
          <p className="text-gray-400 text-xs">
            Budget: ₹{trip.budget.toLocaleString("en-IN")}
          </p>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await API.get("/trips");
        setTrips(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const firstName = user?.name?.split(" ")[0] || "Traveler";

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Hero banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#2A9D8F] to-[#21867a] p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
  style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}
/>
        <p className="text-teal-100 text-sm flex items-center gap-1.5 mb-2">
          <MapPin size={14} /> Your next adventure awaits
        </p>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}!</h1>
        <p className="text-teal-100 text-sm mb-6 max-w-md">
          Plan your dream trips, explore new destinations, and keep everything organized in one place.
        </p>
        <button
          onClick={() => navigate("/trips/new")}
          className="flex items-center gap-2 bg-white text-[#2A9D8F] font-medium text-sm px-5 py-2.5 rounded-full hover:bg-teal-50 transition"
        >
          <PlusCircle size={16} />
          Plan a New Trip
        </button>
      </div>

      {/* Recent Trips */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">Recent Trips</h2>
          <button
            onClick={() => navigate("/trips")}
            className="text-sm text-[#2A9D8F] hover:underline"
          >
            View all
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 h-52 animate-pulse" />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <MapPin size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No trips yet.</p>
            <button
              onClick={() => navigate("/trips/new")}
              className="mt-4 text-sm text-[#2A9D8F] font-medium hover:underline"
            >
              Plan your first trip →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onClick={() => navigate(`/trips/${trip._id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recommended Destinations */}
      <div>
        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Recommended Destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {RECOMMENDED.map((dest) => (
            <div
              key={dest.name}
              onClick={() => navigate("/explore")}
              className={`rounded-2xl bg-gradient-to-br ${dest.gradient} h-36 relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-end p-4`}
            >
              <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full w-fit mb-1">
                {dest.category}
              </span>
              <p className="text-white font-semibold text-sm drop-shadow">{dest.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
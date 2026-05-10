import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, Trash2, MapPin, Calendar, Wallet,
  Globe, Share2, Package, FileText, DollarSign, Map,
  Clock, ChevronDown, ChevronUp, Edit2, Check, X
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "../api/axios";

// Fix leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const TABS = ["Itinerary", "Budget", "Packing", "Notes"];

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Itinerary");
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activities, setActivities] = useState({});
  const [packingItems, setPackingItems] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPublic, setIsPublic] = useState(false);

  // Stop form
  const [showStopForm, setShowStopForm] = useState(false);
  const [stopForm, setStopForm] = useState({ city: "", country: "", startDate: "", endDate: "", lat: "", lng: "", cost: "" });
  const [stopLoading, setStopLoading] = useState(false);

  // Activity form per stop
  const [showActivityForm, setShowActivityForm] = useState({});
  const [activityForm, setActivityForm] = useState({});

  // Packing
  const [newItem, setNewItem] = useState("");
  const [newCategory, setNewCategory] = useState("other");

  // Notes
  const [noteForm, setNoteForm] = useState({ title: "", content: "", date: "" });
  const [showNoteForm, setShowNoteForm] = useState(false);

  // Expanded stops
  const [expandedStops, setExpandedStops] = useState({});

  useEffect(() => { fetchAll(); }, [id]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [tripRes, stopsRes, packRes, notesRes] = await Promise.all([
        api.get(`/trips/${id}`),
        api.get(`/stops/trip/${id}`),
        api.get(`/packing/trip/${id}`),
        api.get(`/notes/trip/${id}`),
      ]);
      setTrip(tripRes.data);
      setIsPublic(tripRes.data.isPublic || false);
      const stopsData = stopsRes.data || [];
      setStops(stopsData);

      // Fetch activities for each stop
      const actMap = {};
      await Promise.all(
        stopsData.map(async (stop) => {
          const res = await api.get(`/activities/stop/${stop._id}`);
          actMap[stop._id] = res.data || [];
        })
      );
      setActivities(actMap);
      setPackingItems(packRes.data || []);
      setNotes(notesRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── STOP CRUD ──
  const addStop = async () => {
    if (!stopForm.city) return;
    if (!stopForm.startDate || !stopForm.endDate) {
      alert("Start date and end date are required.");
      return;
    }
    try {
      setStopLoading(true);
      const payload = {
        trip: id,
        city: stopForm.city,
        country: stopForm.country,
        startDate: stopForm.startDate,
        endDate: stopForm.endDate,
        latitude: stopForm.lat ? parseFloat(stopForm.lat) : null,
        longitude: stopForm.lng ? parseFloat(stopForm.lng) : null,
      };
      // Step 1: Create stop (controller ignores totalCost on create)
      const res = await api.post("/stops", payload);

      // Step 2: If cost provided, immediately update the stop with totalCost
      if (stopForm.cost && Number(stopForm.cost) > 0) {
        await api.put(`/stops/${res.data._id}`, {
          totalCost: Number(stopForm.cost),
        });
      }

      setStopForm({
        city: "",
        country: "",
        startDate: "",
        endDate: "",
        lat: "",
        lng: "",
        cost: "",
      });
      setShowStopForm(false);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add stop.");
    } finally {
      setStopLoading(false);
    }
  };

  const deleteStop = async (stopId) => {
    if (!window.confirm("Delete this stop and all its activities?")) return;
    await api.delete(`/stops/${stopId}`);
    fetchAll();
  };

  // ── ACTIVITY CRUD ──
  const addActivity = async (stopId) => {
    const f = activityForm[stopId] || {};
    if (!f.name) return;
    await api.post("/activities", {
      stop: stopId,
      trip: id,
      name: f.name,
      category: f.category || "sightseeing",
      time: f.time || undefined,
      duration: f.duration ? Number(f.duration) : undefined,
      cost: f.cost ? Number(f.cost) : 0,
    });
    setActivityForm((prev) => ({ ...prev, [stopId]: {} }));
    setShowActivityForm((prev) => ({ ...prev, [stopId]: false }));
    fetchAll();
  };

  const deleteActivity = async (actId) => {
    await api.delete(`/activities/${actId}`);
    fetchAll();
  };

  // ── PUBLIC TOGGLE ──
  const togglePublic = async () => {
    try {
      await api.put(`/trips/${id}`, { isPublic: !isPublic });
      setIsPublic(!isPublic);
    } catch (err) { console.error(err); }
  };

  // ── PACKING ──
  const addPackingItem = async () => {
    if (!newItem.trim()) return;
    await api.post("/packing", {
      trip: id,
      name: newItem.trim(),
      category: newCategory,
    });
    setNewItem("");
    fetchAll();
  };

  const togglePackingItem = async (itemId, packed) => {
    await api.patch(`/packing/${itemId}/toggle`);
    fetchAll();
  };

  const deletePackingItem = async (itemId) => {
    await api.delete(`/packing/${itemId}`);
    fetchAll();
  };

  // ── NOTES ──
  const addNote = async () => {
    if (!noteForm.title.trim()) return;
    await api.post("/notes", { trip: id, ...noteForm });
    setNoteForm({ title: "", content: "", date: "" });
    setShowNoteForm(false);
    fetchAll();
  };

  const deleteNote = async (noteId) => {
    await api.delete(`/notes/${noteId}`);
    fetchAll();
  };

  // ── BUDGET CALC ──
  const totalSpent = stops.reduce((sum, s) => {
    const actCosts = (activities[s._id] || []).reduce((a, act) => a + (act.cost || 0), 0);
    return sum + (s.totalCost || 0) + actCosts;
  }, 0);

  const mapCenter = stops.find(s => s.latitude && s.longitude)
  ? [stops.find(s => s.latitude && s.longitude).latitude, stops.find(s => s.latitude && s.longitude).longitude]
  : [20, 78];
  const polylinePoints = stops.filter(s => s.latitude && s.longitude).map(s => [s.latitude, s.longitude]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#F5F5F0" }}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (!trip) return <div className="p-8 text-gray-500">Trip not found.</div>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F5F0" }}>
      {/* Hero Banner */}
      <div
        className="relative h-36 flex items-end px-6 pb-4"
        style={{
          background: trip.coverPhoto
            ? `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url(${trip.coverPhoto}) center/cover`
            : "linear-gradient(135deg, #2A9D8F 0%, #21867a 100%)",
        }}
      >
        <button
          onClick={() => navigate("/trips")}
          className="absolute top-4 left-4 flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={togglePublic}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition ${
              isPublic
                ? "bg-white text-teal-700"
                : "bg-white/20 text-white border border-white/30"
            }`}
          >
            <Globe size={12} />
            {isPublic ? "Public" : "Private"}
          </button>
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/20 text-white border border-white/30">
            <Share2 size={12} /> Share
          </button>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{trip.name}</h1>
          <div className="flex items-center gap-3 text-white/80 text-xs mt-0.5">
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {new Date(trip.startDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {" – "}
              {new Date(trip.endDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Wallet size={11} /> ₹{(trip.budget || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-6">
        <div className="flex gap-0">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                tab === t
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* ── ITINERARY TAB ── */}
        {tab === "Itinerary" && (
          <div className="space-y-4">
            {/* Map */}
            {stops.some((s) => s.latitude && s.longitude) && (
              <div
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                style={{ height: 280 }}
              >
                <MapContainer
                  center={mapCenter}
                  zoom={5}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap"
                  />
                  {stops
                    .filter((s) => s.latitude && s.longitude)
                    .map((stop) => (
                      <Marker
                        key={stop._id}
                        position={[stop.latitude, stop.longitude]}
                      >
                        <Popup>
                          {stop.city}, {stop.country}
                        </Popup>
                      </Marker>
                    ))}
                  {polylinePoints.length > 1 && (
                    <Polyline
                      positions={polylinePoints}
                      color="#2A9D8F"
                      weight={2}
                      dashArray="6,6"
                    />
                  )}
                </MapContainer>
              </div>
            )}

            {/* Stops & Activities Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Map size={16} className="text-teal-500" /> Stops & Activities
              </h2>
              <button
                onClick={() => setShowStopForm(!showStopForm)}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg text-white font-medium"
                style={{ backgroundColor: "#2A9D8F" }}
              >
                <Plus size={14} /> Add Stop
              </button>
            </div>

            {/* Add Stop Form */}
            {showStopForm && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
                <p className="text-sm font-medium text-gray-700">New Stop</p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="input-field"
                    placeholder="City *"
                    value={stopForm.city}
                    onChange={(e) =>
                      setStopForm({ ...stopForm, city: e.target.value })
                    }
                  />
                  <input
                    className="input-field"
                    placeholder="Country"
                    value={stopForm.country}
                    onChange={(e) =>
                      setStopForm({ ...stopForm, country: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    className="input-field"
                    placeholder="Start Date"
                    value={stopForm.startDate}
                    onChange={(e) =>
                      setStopForm({ ...stopForm, startDate: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    className="input-field"
                    placeholder="End Date"
                    value={stopForm.endDate}
                    onChange={(e) =>
                      setStopForm({ ...stopForm, endDate: e.target.value })
                    }
                  />
                  <input
                    className="input-field"
                    placeholder="Latitude (e.g. 48.8566)"
                    value={stopForm.lat}
                    onChange={(e) =>
                      setStopForm({ ...stopForm, lat: e.target.value })
                    }
                  />
                  <input
                    className="input-field"
                    placeholder="Longitude (e.g. 2.3522)"
                    value={stopForm.lng}
                    onChange={(e) =>
                      setStopForm({ ...stopForm, lng: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="input-field col-span-2"
                    placeholder="Estimated Cost (₹)"
                    value={stopForm.cost}
                    onChange={(e) =>
                      setStopForm({ ...stopForm, cost: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowStopForm(false)}
                    className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addStop}
                    disabled={stopLoading}
                    className="text-sm px-4 py-1.5 rounded-lg text-white font-medium"
                    style={{ backgroundColor: "#2A9D8F" }}
                  >
                    {stopLoading ? "Adding..." : "Add Stop"}
                  </button>
                </div>
              </div>
            )}

            {/* Stops List */}
            {stops.length === 0 && !showStopForm && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400 text-sm">
                <MapPin size={28} className="mx-auto mb-2 text-gray-300" />
                No stops yet. Add your first destination!
              </div>
            )}

            {stops.map((stop, idx) => (
              <div
                key={stop._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Stop Header */}
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: "#2A9D8F" }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {stop.city}
                        {stop.country ? `, ${stop.country}` : ""}
                      </p>
                      {(stop.startDate || stop.endDate) && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Calendar size={10} />
                          {stop.startDate &&
                            new Date(stop.startDate).toLocaleDateString(
                              "en-IN",
                              { day: "numeric", month: "short" },
                            )}
                          {stop.startDate && stop.endDate && " – "}
                          {stop.endDate &&
                            new Date(stop.endDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-teal-700">
                      ₹{(stop.totalCost || 0).toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => deleteStop(stop._id)}
                      className="text-gray-300 hover:text-red-400 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                    <button
                      onClick={() =>
                        setExpandedStops((p) => ({
                          ...p,
                          [stop._id]: !p[stop._id],
                        }))
                      }
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      {expandedStops[stop._id] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Activities */}
                {expandedStops[stop._id] && (
                  <div className="border-t border-gray-50 px-5 py-3 space-y-2">
                    {(activities[stop._id] || []).map((act) => (
                      <div
                        key={act._id}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 capitalize">
                            {act.category}
                          </span>
                          <span className="text-sm text-gray-700">
                            {act.name}
                          </span>
                          {act.time && (
                            <span className="text-xs text-gray-400 flex items-center gap-0.5">
                              <Clock size={10} />
                              {act.time}
                            </span>
                          )}
                          {act.duration && (
                            <span className="text-xs text-gray-400">
                              {act.duration}h
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            ₹{(act.cost || 0).toLocaleString("en-IN")}
                          </span>
                          <button
                            onClick={() => deleteActivity(act._id)}
                            className="text-gray-300 hover:text-red-400 transition"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Activity Form */}
                    {showActivityForm[stop._id] ? (
                      <div className="space-y-2 pt-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            className="input-field"
                            placeholder="Activity name *"
                            value={activityForm[stop._id]?.name || ""}
                            onChange={(e) =>
                              setActivityForm((p) => ({
                                ...p,
                                [stop._id]: {
                                  ...p[stop._id],
                                  name: e.target.value,
                                },
                              }))
                            }
                          />
                          <select
                            className="input-field"
                            value={
                              activityForm[stop._id]?.category || "sightseeing"
                            }
                            onChange={(e) =>
                              setActivityForm((p) => ({
                                ...p,
                                [stop._id]: {
                                  ...p[stop._id],
                                  category: e.target.value,
                                },
                              }))
                            }
                          >
                            <option value="sightseeing">Sightseeing</option>
                            <option value="food">Food</option>
                            <option value="culture">Culture</option>
                            <option value="adventure">Adventure</option>
                            <option value="transport">Transport</option>
                            <option value="accommodation">Accommodation</option>
                            <option value="other">Other</option>
                          </select>
                          <input
                            type="time"
                            className="input-field"
                            value={activityForm[stop._id]?.time || ""}
                            onChange={(e) =>
                              setActivityForm((p) => ({
                                ...p,
                                [stop._id]: {
                                  ...p[stop._id],
                                  time: e.target.value,
                                },
                              }))
                            }
                          />
                          <input
                            type="number"
                            className="input-field"
                            placeholder="Duration (hrs)"
                            value={activityForm[stop._id]?.duration || ""}
                            onChange={(e) =>
                              setActivityForm((p) => ({
                                ...p,
                                [stop._id]: {
                                  ...p[stop._id],
                                  duration: e.target.value,
                                },
                              }))
                            }
                          />
                          <input
                            type="number"
                            className="input-field col-span-2"
                            placeholder="Cost (₹)"
                            value={activityForm[stop._id]?.cost || ""}
                            onChange={(e) =>
                              setActivityForm((p) => ({
                                ...p,
                                [stop._id]: {
                                  ...p[stop._id],
                                  cost: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() =>
                              setShowActivityForm((p) => ({
                                ...p,
                                [stop._id]: false,
                              }))
                            }
                            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => addActivity(stop._id)}
                            className="text-xs px-3 py-1.5 rounded-lg text-white"
                            style={{ backgroundColor: "#2A9D8F" }}
                          >
                            Add Activity
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setExpandedStops((p) => ({ ...p, [stop._id]: true }));
                          setShowActivityForm((p) => ({
                            ...p,
                            [stop._id]: true,
                          }));
                        }}
                        className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 mt-1 transition"
                      >
                        <Plus size={13} /> Add Activity
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── BUDGET TAB ── */}
        {tab === "Budget" && (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "Total Budget",
                  value: trip.budget || 0,
                  color: "text-gray-800",
                },
                {
                  label: "Total Spent",
                  value: totalSpent,
                  color: "text-orange-600",
                },
                {
                  label: "Remaining",
                  value: (trip.budget || 0) - totalSpent,
                  color:
                    (trip.budget || 0) - totalSpent < 0
                      ? "text-red-600"
                      : "text-teal-600",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                >
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className={`text-xl font-bold ${color}`}>
                    ₹{value.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            {trip.budget > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Budget Used</span>
                  <span>
                    {Math.min(
                      100,
                      Math.round((totalSpent / trip.budget) * 100),
                    )}
                    %
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (totalSpent / trip.budget) * 100)}%`,
                      backgroundColor:
                        totalSpent > trip.budget ? "#ef4444" : "#2A9D8F",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Per Stop Breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4 text-sm">
                Breakdown by Stop
              </h3>
              {stops.length === 0 ? (
                <p className="text-sm text-gray-400">No stops added yet.</p>
              ) : (
                <div className="space-y-3">
                  {stops.map((stop) => {
                    const actCost = (activities[stop._id] || []).reduce(
                      (a, act) => a + (act.cost || 0),
                      0,
                    );
                    const total = (stop.totalCost || 0) + actCost;
                    return (
                      <div
                        key={stop._id}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {stop.city}
                            {stop.country ? `, ${stop.country}` : ""}
                          </p>
                          <p className="text-xs text-gray-400">
                            Stop: ₹
                            {(stop.totalCost || 0).toLocaleString("en-IN")} ·
                            Activities: ₹{actCost.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-800">
                          ₹{total.toLocaleString("en-IN")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PACKING TAB ── */}
        {tab === "Packing" && (
          <div className="space-y-4">
            {/* Add Item */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex gap-2">
                <input
                  className="input-field flex-1"
                  placeholder="Add item (e.g. Passport)"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPackingItem()}
                />
                <select
                  className="input-field w-36"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  {[
                    "other",
                    "clothing",
                    "electronics",
                    "documents",
                    "toiletries",
                    "medicine",
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addPackingItem}
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                  style={{ backgroundColor: "#2A9D8F" }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Items grouped by category */}
            {packingItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400 text-sm">
                <Package size={28} className="mx-auto mb-2 text-gray-300" />
                No packing items yet.
              </div>
            ) : (
              Object.entries(
                packingItems.reduce((acc, item) => {
                  const cat = item.category || "General";
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(item);
                  return acc;
                }, {}),
              ).map(([cat, items]) => (
                <div
                  key={cat}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="px-5 py-3 border-b border-gray-50">
                    <p className="text-sm font-semibold text-gray-700">{cat}</p>
                    <p className="text-xs text-gray-400">
                      {items.filter((i) => i.isPacked).length}/{items.length}{" "}
                      packed
                    </p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between px-5 py-3"
                      >
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={item.isPacked}
                            onChange={() =>
                              togglePackingItem(item._id, item.isPacked)
                            }
                            className="w-4 h-4 rounded accent-teal-500"
                          />
                          <span
                            className={`text-sm ${item.isPacked ? "line-through text-gray-400" : "text-gray-700"}`}
                          >
                            {item.name}
                          </span>
                        </label>
                        <button
                          onClick={() => deletePackingItem(item._id)}
                          className="text-gray-300 hover:text-red-400 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── NOTES TAB ── */}
        {tab === "Notes" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <FileText size={16} className="text-teal-500" /> Trip Notes &
                Journal
              </h2>
              <button
                onClick={() => setShowNoteForm(!showNoteForm)}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg text-white font-medium"
                style={{ backgroundColor: "#2A9D8F" }}
              >
                <Plus size={14} /> Add Note
              </button>
            </div>

            {showNoteForm && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
                <input
                  className="input-field w-full"
                  placeholder="Title *"
                  value={noteForm.title}
                  onChange={(e) =>
                    setNoteForm({ ...noteForm, title: e.target.value })
                  }
                />
                <textarea
                  className="input-field w-full resize-none"
                  rows={4}
                  placeholder="Write your note..."
                  value={noteForm.content}
                  onChange={(e) =>
                    setNoteForm({ ...noteForm, content: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="input-field w-full"
                  value={noteForm.date}
                  onChange={(e) =>
                    setNoteForm({ ...noteForm, date: e.target.value })
                  }
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowNoteForm(false)}
                    className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addNote}
                    className="text-sm px-4 py-1.5 rounded-lg text-white"
                    style={{ backgroundColor: "#2A9D8F" }}
                  >
                    Save Note
                  </button>
                </div>
              </div>
            )}

            {notes.length === 0 && !showNoteForm ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400 text-sm">
                <FileText size={28} className="mx-auto mb-2 text-gray-300" />
                No notes yet. Start journaling your trip!
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-gray-800">
                        {note.title}
                      </p>
                      <div className="flex items-center gap-2">
                        {note.date && (
                          <span className="text-xs text-gray-400">
                            {new Date(note.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        )}
                        <button
                          onClick={() => deleteNote(note._id)}
                          className="text-gray-300 hover:text-red-400 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {note.content && (
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global input style */}
      <style>{`
        .input-field {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          outline: none;
          transition: all 0.15s;
          background: white;
          color: #374151;
        }
        .input-field:focus {
          border-color: #2A9D8F;
          box-shadow: 0 0 0 2px rgba(42,157,143,0.15);
        }
      `}</style>
    </div>
  );
}
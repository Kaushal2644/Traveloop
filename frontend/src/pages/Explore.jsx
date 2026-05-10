import { useState } from "react";
import { Search, MapPin, Star, DollarSign, ChevronDown } from "lucide-react";

const REGIONS = ["All", "Europe", "Asia", "Americas", "Africa", "Oceania", "Middle East"];

const DESTINATIONS = [
  // Europe
  { id: 1, city: "Paris", country: "France", region: "Europe", rating: 10, cost: "₹₹₹₹", description: "The city of lights, known for its art, fashion, and iconic landmarks.", activities: ["Visit the Louvre Museum", "Stroll along the Seine River", "Explore Montmartre"] },
  { id: 2, city: "Rome", country: "Italy", region: "Europe", rating: 9, cost: "₹₹₹", description: "A historic city filled with ancient ruins, stunning churches, and delicious cuisine.", activities: ["Explore the Colosseum", "Visit the Vatican Museums", "Toss a coin in the Trevi Fountain"] },
  { id: 3, city: "Barcelona", country: "Spain", region: "Europe", rating: 9, cost: "₹₹₹", description: "A vibrant city famous for its unique architecture, beaches, and lively culture.", activities: ["Visit the Sagrada Família", "Stroll through Park Güell", "Relax at Barceloneta Beach"] },
  { id: 4, city: "Amsterdam", country: "Netherlands", region: "Europe", rating: 8, cost: "₹₹", description: "Known for its picturesque canals, historic houses, and vibrant arts scene.", activities: ["Explore the Van Gogh Museum", "Take a canal cruise", "Visit Anne Frank House"] },
  { id: 5, city: "Vienna", country: "Austria", region: "Europe", rating: 8, cost: "₹₹₹", description: "A city rich in musical heritage, history, and stunning Baroque architecture.", activities: ["Visit the Schönbrunn Palace", "Attend a classical music concert", "Explore the Kunsthistorisches Museum"] },
  { id: 6, city: "Prague", country: "Czech Republic", region: "Europe", rating: 7, cost: "₹₹", description: "A fairy-tale city known for its stunning old town and historic castle.", activities: ["Explore Prague Castle", "Stroll across Charles Bridge", "Visit Old Town Square"] },
  { id: 7, city: "Budapest", country: "Hungary", region: "Europe", rating: 8, cost: "₹₹", description: "A city split by the Danube River, known for its thermal baths and vibrant nightlife.", activities: ["Relax in the Széchenyi Thermal Bath", "Visit Buda Castle", "Cruise the Danube"] },
  { id: 8, city: "Copenhagen", country: "Denmark", region: "Europe", rating: 8, cost: "₹₹₹", description: "A charming city famous for its design, canals, and the iconic Little Mermaid.", activities: ["Visit Tivoli Gardens", "Explore Nyhavn", "Tour the Rosenborg Castle"] },

  // Asia
  { id: 9, city: "Tokyo", country: "Japan", region: "Asia", rating: 10, cost: "₹₹₹", description: "A dazzling metropolis blending ultra-modern technology with ancient tradition.", activities: ["Explore Shibuya Crossing", "Visit Senso-ji Temple", "Tour Tsukiji Fish Market"] },
  { id: 10, city: "Kyoto", country: "Japan", region: "Asia", rating: 9, cost: "₹₹₹", description: "Japan's cultural heart with thousands of temples, geisha districts, and bamboo groves.", activities: ["Walk through Arashiyama Bamboo Grove", "Visit Fushimi Inari Shrine", "Explore Gion District"] },
  { id: 11, city: "Bali", country: "Indonesia", region: "Asia", rating: 9, cost: "₹₹", description: "A tropical paradise known for yoga retreats, rice terraces, and stunning temples.", activities: ["Visit Tanah Lot Temple", "Explore Ubud Rice Terraces", "Surf at Kuta Beach"] },
  { id: 12, city: "Bangkok", country: "Thailand", region: "Asia", rating: 8, cost: "₹", description: "A vibrant city of ornate temples, street food, and buzzing nightlife.", activities: ["Visit the Grand Palace", "Explore Chatuchak Market", "Cruise the Chao Phraya River"] },
  { id: 13, city: "Singapore", country: "Singapore", region: "Asia", rating: 9, cost: "₹₹₹₹", description: "A gleaming city-state famous for its futuristic skyline and incredible food scene.", activities: ["Visit Gardens by the Bay", "Explore Sentosa Island", "Stroll through Chinatown"] },
  { id: 14, city: "Delhi", country: "India", region: "Asia", rating: 8, cost: "₹", description: "India's capital — a city of Mughal monuments, spicy street food, and rich history.", activities: ["Visit Red Fort", "Explore Qutub Minar", "Wander through Chandni Chowk"] },

  // Americas
  { id: 15, city: "New York", country: "USA", region: "Americas", rating: 10, cost: "₹₹₹₹", description: "The city that never sleeps — iconic skyline, world-class museums, and diverse culture.", activities: ["Visit the Statue of Liberty", "Walk Central Park", "Explore Times Square"] },
  { id: 16, city: "Rio de Janeiro", country: "Brazil", region: "Americas", rating: 9, cost: "₹₹", description: "A stunning coastal city famous for Carnival, samba, and Christ the Redeemer.", activities: ["Visit Christ the Redeemer", "Relax at Copacabana Beach", "Hike Sugarloaf Mountain"] },
  { id: 17, city: "Mexico City", country: "Mexico", region: "Americas", rating: 8, cost: "₹₹", description: "A sprawling capital rich in Aztec history, colonial architecture, and incredible food.", activities: ["Explore Teotihuacán", "Visit the Zócalo", "Tour the National Museum of Anthropology"] },
  { id: 18, city: "Buenos Aires", country: "Argentina", region: "Americas", rating: 8, cost: "₹₹", description: "The Paris of South America — known for tango, steak, and European-style boulevards.", activities: ["Watch a tango show", "Explore La Boca", "Visit Recoleta Cemetery"] },

  // Africa
  { id: 19, city: "Cape Town", country: "South Africa", region: "Africa", rating: 9, cost: "₹₹₹", description: "A breathtaking city at the tip of Africa with mountains, beaches, and vineyards.", activities: ["Hike Table Mountain", "Visit Cape Point", "Explore the V&A Waterfront"] },
  { id: 20, city: "Marrakech", country: "Morocco", region: "Africa", rating: 8, cost: "₹₹", description: "A magical city of bustling souks, ornate palaces, and Saharan adventures.", activities: ["Explore Djemaa el-Fna", "Visit the Bahia Palace", "Shop in the medina souks"] },

  // Oceania
  { id: 21, city: "Sydney", country: "Australia", region: "Oceania", rating: 9, cost: "₹₹₹₹", description: "Australia's iconic harbour city with world-famous landmarks and beaches.", activities: ["Visit the Sydney Opera House", "Climb the Harbour Bridge", "Relax at Bondi Beach"] },
  { id: 22, city: "Melbourne", country: "Australia", region: "Oceania", rating: 8, cost: "₹₹₹", description: "A cosmopolitan city celebrated for its coffee culture, art, and sports.", activities: ["Explore Federation Square", "Walk the Yarra River", "Visit the Queen Victoria Market"] },

  // Middle East
  { id: 23, city: "Dubai", country: "UAE", region: "Middle East", rating: 9, cost: "₹₹₹₹", description: "A futuristic desert city of skyscrapers, luxury malls, and golden deserts.", activities: ["Visit the Burj Khalifa", "Explore the Dubai Mall", "Desert safari at sunset"] },
  { id: 24, city: "Istanbul", country: "Turkey", region: "Middle East", rating: 9, cost: "₹₹", description: "A city straddling two continents, rich in Ottoman history and vibrant bazaars.", activities: ["Visit the Hagia Sophia", "Explore the Grand Bazaar", "Cruise the Bosphorus"] },
];

const COST_COLORS = {
  "₹": "text-green-600",
  "₹₹": "text-teal-600",
  "₹₹₹": "text-orange-500",
  "₹₹₹₹": "text-red-500",
};

export default function Explore() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const handleSearch = () => {
    setSearched(true);
    const q = search.toLowerCase().trim();
    const filtered = DESTINATIONS.filter((d) => {
      const matchRegion = region === "All" || d.region === region;
      const matchSearch =
        !q ||
        d.city.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q);
      return matchRegion && matchSearch;
    });
    setResults(filtered);
    setExpanded(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const displayList = searched ? results : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F5F0" }}>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Explore Destinations</h1>
          <p className="text-sm text-gray-500 mt-1">Discover cities and activities to add to your trips</p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search cities, countries, or regions..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ "--tw-ring-color": "#2A9D8F" }}
            />
          </div>

          {/* Region Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRegionDropdown(!showRegionDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-gray-300 transition min-w-36"
            >
              {region}
              <ChevronDown size={14} className="ml-auto text-gray-400" />
            </button>
            {showRegionDropdown && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-gray-100 rounded-xl shadow-lg z-10 min-w-36 overflow-hidden">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRegion(r); setShowRegionDropdown(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-gray-50 flex items-center justify-between ${region === r ? "text-teal-600 font-medium" : "text-gray-700"}`}
                  >
                    {r}
                    {region === r && <span className="text-teal-500">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition"
            style={{ backgroundColor: "#2A9D8F" }}
          >
            <Search size={15} /> Search
          </button>
        </div>

        {/* Empty State */}
        {!searched && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <MapPin size={40} className="mb-3 text-gray-300" />
            <p className="text-sm">Search for destinations to start exploring</p>
          </div>
        )}

        {/* No Results */}
        {searched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Search size={40} className="mb-3 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">No destinations found</p>
            <p className="text-xs mt-1">Try a different search term or region</p>
          </div>
        )}

        {/* Results Grid */}
        {searched && results.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-4">{results.length} destination{results.length !== 1 ? "s" : ""} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((dest) => (
                <div
                  key={dest.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Card Image Placeholder */}
                  <div
                    className="h-36 flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #e8f5f3 0%, #fef3ee 100%)",
                    }}
                  >
                    <MapPin size={28} className="text-teal-300" />
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{dest.city}</h3>
                        <p className="text-xs text-gray-400">{dest.country}</p>
                      </div>
                      <div className="flex items-center gap-1 text-orange-400">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-semibold text-gray-700">{dest.rating}</span>
                      </div>
                    </div>

                    {/* Cost */}
                    <p className={`text-xs font-medium mb-2 ${COST_COLORS[dest.cost] || "text-gray-500"}`}>
                      {dest.cost} · {dest.region}
                    </p>

                    <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                      {dest.description}
                    </p>

                    {/* Activities toggle */}
                    <button
                      onClick={() => setExpanded(expanded === dest.id ? null : dest.id)}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 transition"
                    >
                      {expanded === dest.id ? "Hide" : "Show"} activities
                      <ChevronDown
                        size={12}
                        className={`transition-transform ${expanded === dest.id ? "rotate-180" : ""}`}
                      />
                    </button>

                    {expanded === dest.id && (
                      <ul className="mt-2 space-y-1">
                        {dest.activities.map((act, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                            {act}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Close dropdown on outside click */}
      {showRegionDropdown && (
        <div className="fixed inset-0 z-0" onClick={() => setShowRegionDropdown(false)} />
      )}
    </div>
  );
}
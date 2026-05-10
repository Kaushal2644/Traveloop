import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Map,
  PlusCircle,
  Compass,
  Globe,
  User,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",    to: "/dashboard", icon: LayoutDashboard },
  { label: "My Trips",     to: "/trips",     icon: Map },
  { label: "New Trip",     to: "/trips/new", icon: PlusCircle },
  { label: "Explore",      to: "/explore",   icon: Compass },
  { label: "Shared Trips", to: "/shared",    icon: Globe },
];

const bottomItems = [
  { label: "Profile", to: "/profile", icon: User },
  { label: "Admin",   to: "/admin",   icon: BarChart2 },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[220px]"
      } min-h-screen`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-[#2A9D8F] flex items-center justify-center flex-shrink-0">
          <Compass size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="text-[#1a1a1a] font-semibold text-lg tracking-tight">
            Traveloop
          </span>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex flex-col gap-1 px-2 py-4 flex-1">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#2A9D8F] text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="flex flex-col gap-1 px-2 pt-4 border-t border-gray-100">
        {bottomItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#2A9D8F] text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        {/* User info + Logout */}
        <div className="mt-2 mb-4">
          {!collapsed && (
            <div className="px-3 py-2 mb-1">
              <p className="text-xs font-medium text-gray-700 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight size={12} className="text-gray-500" />
        ) : (
          <ChevronLeft size={12} className="text-gray-500" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
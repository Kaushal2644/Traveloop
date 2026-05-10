import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyTrips from "./pages/MyTrips";
import NewTrip from "./pages/NewTrip";
import TripDetail from "./pages/TripDetail";
import Explore from "./pages/Explore";
import SharedTrips from "./pages/SharedTrips";
import PackingList from "./pages/PackingList";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

// Route guard — redirects to /login if not authenticated
const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

// Route guard — redirects to /dashboard if already authenticated
const PublicRoute = ({ children }) => {
  const { token } = useAuth();
  return !token ? children : <Navigate to="/dashboard" replace />;
};

// Layout with sidebar for authenticated pages
const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#F5F5F0]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
      <Route path="/trips" element={<PrivateRoute><AppLayout><MyTrips /></AppLayout></PrivateRoute>} />
      <Route path="/trips/new" element={<PrivateRoute><AppLayout><NewTrip /></AppLayout></PrivateRoute>} />
      <Route path="/trips/:id" element={<PrivateRoute><AppLayout><TripDetail /></AppLayout></PrivateRoute>} />
      <Route path="/trips/:id/packing" element={<PrivateRoute><AppLayout><PackingList /></AppLayout></PrivateRoute>} />
      <Route path="/trips/:id/notes" element={<PrivateRoute><AppLayout><Notes /></AppLayout></PrivateRoute>} />
      <Route path="/explore" element={<PrivateRoute><AppLayout><Explore /></AppLayout></PrivateRoute>} />
      <Route path="/shared" element={<PrivateRoute><AppLayout><SharedTrips /></AppLayout></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><AppLayout><Profile /></AppLayout></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><AppLayout><Admin /></AppLayout></PrivateRoute>} />

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
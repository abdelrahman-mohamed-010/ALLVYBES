import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Header } from "./components/Layout/Header";
import { Navigation } from "./components/Layout/Navigation";
import { HomePage } from "./components/Home/HomePage";
import { CheckInForm } from "./components/CheckIn/CheckInForm";
import { EventLobby } from "./components/Lobby/EventLobby";
import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { EventManagement } from "./components/Admin/EventManagement";
import { EventsPage } from "./components/Events/EventsPage";
import { MessagesPage } from "./components/Messages/MessagesPage";
import { PlatformsPage } from "./components/Platforms/PlatformsPage";
import { SettingsPage } from "./components/Settings/SettingsPage";
import { ArtistProfile } from "./components/Profile/ArtistProfile";
import { SignIn } from "./components/Auth/SignIn";
import { SignUp } from "./components/Auth/SignUp";
import { ForgotPassword } from "./components/Auth/ForgotPassword";

import { ProtectedRoute } from "./hooks/ProtectedRoute";
import { AdminRoute } from "./hooks/AdminRoute";
import { useStore } from "./store/useStore";

// Layout component to handle header and navigation logic
const AppLayout = () => {
  const location = useLocation();
  const { darkMode, currentUser } = useStore();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "ALL VYBES";
      case "/events":
        return "Events";
      case "/checkin":
        return "Check In";
      case "/lobby":
        return "Event Lobby";
      case "/admin":
        return "Admin Dashboard";
      case "/admin/events":
        return "Event Management";
      case "/messages":
        return "Messages";
      case "/platforms":
        return "Platforms";
      case "/settings":
        return "Settings";
      case "/profile":
        return "Profile";
      default:
        return "ALL VYBES";
    }
  };

  const showNavigation =
    location.pathname !== "/checkin" &&
    location.pathname !== "/admin/events" &&
    location.pathname !== "/login" &&
    location.pathname !== "/signup" &&
    location.pathname !== "/forgot-password";

  const showHeader =
    location.pathname !== "/" &&
    location.pathname !== "/checkin" &&
    location.pathname !== "/login" &&
    location.pathname !== "/signup" &&
    location.pathname !== "/forgot-password";

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-dark-bg text-dark-text" : "bg-white text-gray-900"
      }`}
    >
      {showHeader && <Header title={getPageTitle()} />}

      <main className={showNavigation ? "pb-16" : ""}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes */}

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/checkin" element={<CheckInForm />} />
            <Route path="/lobby" element={<EventLobby />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/platforms" element={<PlatformsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/profile"
              element={
                currentUser ? (
                  <ArtistProfile artist={currentUser} isOwnProfile={true} />
                ) : (
                  <HomePage />
                )
              }
            />

            {/* Admin-only routes nested inside protected */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/events" element={<EventManagement />} />
            </Route>
          </Route>

          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {showNavigation && <Navigation />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;

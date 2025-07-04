import React from "react";
import {
  QrCode,
  Zap,
  UserPlus,
  LogIn,
  Star,
  Calendar,
  MapPin,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "../UI/Button";
import { useStore } from "../../store/useStore";
import { useNavigate, Link } from "react-router-dom";

export const HomePage: React.FC = () => {
  const { currentEvent, darkMode, events, users } = useStore();
  const navigate = useNavigate();

  // Featured artists (top performers from recent events)
  const featuredArtists = users.slice(0, 4);

  // Featured events (upcoming and live)
  const featuredEvents = events
    .filter((e) => e.isLive || e.date > new Date())
    .slice(0, 3);

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-dark-bg" : "bg-white"} pb-20`}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-green/20 to-primary-purple/20" />
        <div className="relative px-6 py-12 text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-primary-green to-primary-purple bg-clip-text text-transparent">
              ALL VYBES
            </h1>
            <p
              className={`text-lg ${
                darkMode ? "text-dark-text" : "text-gray-600"
              }`}
            >
              Connect • Perform • Network
            </p>
          </div>

          {/* Live Event Banner */}
          {currentEvent && (
            <div
              className={`mb-8 p-6 rounded-2xl ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-gray-50 border border-gray-200"
              } animate-pulse-slow cursor-pointer hover:scale-105 transition-transform duration-200`}
              onClick={() => navigate("/events")}
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2" />
                <span className="text-sm font-medium text-red-500">
                  LIVE NOW
                </span>
              </div>
              <h2
                className={`text-2xl font-bold ${
                  darkMode ? "text-dark-text" : "text-gray-900"
                }`}
              >
                {currentEvent.name}
              </h2>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } mb-2`}
              >
                {currentEvent.venue} • {currentEvent.location}
              </p>
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                {currentEvent.checkedInCount} artists checked in • Tap to join
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 space-y-4 mb-8">
        <Button
          onClick={() => navigate("/checkin")}
          variant="primary"
          size="lg"
          icon={QrCode}
          glow
          className="w-full"
        >
          Scan QR to Check In
        </Button>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => navigate("/platforms")}
            variant="secondary"
            icon={Zap}
            className="w-full"
          >
            View Platforms
          </Button>

          <Button
            onClick={() => navigate("/profile")}
            variant="secondary"
            icon={UserPlus}
            className="w-full"
          >
            Create Profile
          </Button>
        </div>

        <Button
          onClick={() => navigate("/login")}
          variant="ghost"
          icon={LogIn}
          className="w-full"
        >
          Sign In
        </Button>
        <Button
          onClick={() => navigate("/signup")}
          variant="ghost"
          icon={UserPlus}
          className="w-full"
        >
          Sign Up
        </Button>
      </div>

      {/* Featured Artists */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-xl font-bold ${
              darkMode ? "text-dark-text" : "text-gray-900"
            }`}
          >
            Featured Artists
          </h3>
          <Link
            to="/lobby"
            className={`inline-flex items-center px-3 py-1 rounded-md text-sm transition-colors ${
              darkMode
                ? "text-gray-400 hover:text-dark-text hover:bg-gray-800"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            View All
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {featuredArtists.map((artist) => (
            <Link
              key={artist.id}
              to={`/lobby/${artist.id}`}
              className={`p-4 rounded-xl border cursor-pointer ${
                darkMode
                  ? "border-gray-700 bg-gray-800 hover:bg-gray-700"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              } hover:scale-105 transition-all duration-200`}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-green to-primary-purple flex items-center justify-center mx-auto mb-3">
                  {artist.profileImage ? (
                    <img
                      src={artist.profileImage}
                      alt={artist.artistName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-xl">
                      {artist.artistName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <h4
                  className={`font-semibold mb-1 ${
                    darkMode ? "text-dark-text" : "text-gray-900"
                  }`}
                >
                  {artist.artistName}
                </h4>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  @{artist.instagram}
                </p>
                <div className="flex items-center justify-center mt-2">
                  <Star className="text-yellow-500 mr-1" size={14} />
                  <span
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Featured
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Events */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-xl font-bold ${
              darkMode ? "text-dark-text" : "text-gray-900"
            }`}
          >
            Featured Events
          </h3>
          <Link
            to="/events"
            className={`inline-flex items-center px-3 py-1 rounded-md text-sm transition-colors ${
              darkMode
                ? "text-gray-400 hover:text-dark-text hover:bg-gray-800"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            View All
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="space-y-4">
          {featuredEvents.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className={`p-4 rounded-xl border cursor-pointer ${
                darkMode
                  ? "border-gray-700 bg-gray-800 hover:bg-gray-700"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              } hover:scale-[1.02] transition-all duration-200 block`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4
                      className={`font-bold ${
                        darkMode ? "text-dark-text" : "text-gray-900"
                      }`}
                    >
                      {event.name}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.isLive
                          ? "text-red-500 bg-red-100 dark:bg-red-900/30"
                          : "text-green-500 bg-green-100 dark:bg-green-900/30"
                      }`}
                    >
                      {event.isLive ? "LIVE" : "UPCOMING"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      >
                        {event.date.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} />
                      <span
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      >
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={14} />
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {event.checkedInCount} checked in
                    </span>
                  </div>
                </div>
                {event.image && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden ml-4">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6">
        <h3
          className={`text-xl font-bold mb-6 ${
            darkMode ? "text-dark-text" : "text-gray-900"
          }`}
        >
          What You Can Do
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Network Live",
              description: "Connect with artists at your event in real-time",
              icon: "🤝",
            },
            {
              title: "Performance Queue",
              description: "Get notified when it's your time to perform",
              icon: "🎤",
            },
            {
              title: "Direct Messaging",
              description: "Chat privately with other artists",
              icon: "💬",
            },
            {
              title: "Platform Discovery",
              description: "Find brands, collectives, and opportunities",
              icon: "🚀",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-gray-50 border border-gray-200"
              } hover:scale-105 transition-transform duration-200`}
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h4
                className={`font-semibold mb-2 ${
                  darkMode ? "text-dark-text" : "text-gray-900"
                }`}
              >
                {feature.title}
              </h4>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

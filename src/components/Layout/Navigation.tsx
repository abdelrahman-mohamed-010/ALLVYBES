import React from "react";
import {
  Home,
  Users,
  MessageCircle,
  Settings,
  Zap,
  Calendar,
} from "lucide-react";
import { useStore } from "../../store/useStore";
import { Link, useLocation } from "react-router-dom";

export const Navigation: React.FC = () => {
  const { darkMode } = useStore();
  const location = useLocation();

  const tabs = [
    { id: "/", icon: Home, label: "Home", path: "/" },
    { id: "events", icon: Calendar, label: "Events", path: "/events" },
    { id: "lobby", icon: Users, label: "Lobby", path: "/lobby" },
    {
      id: "messages",
      icon: MessageCircle,
      label: "Messages",
      path: "/messages",
    },
    { id: "platforms", icon: Zap, label: "Platforms", path: "/platforms" },
    { id: "settings", icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 ${
        darkMode ? "bg-dark-bg border-gray-800" : "bg-white border-gray-200"
      } border-t z-50`}
    >
      <div className="flex justify-around items-center py-2">
        {tabs.map(({ id, icon: Icon, label, path }) => (
          <Link
            key={id}
            to={path}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
              location.pathname === path
                ? `text-primary-green ${
                    darkMode ? "bg-gray-800" : "bg-gray-100"
                  }`
                : darkMode
                ? "text-gray-400 hover:text-dark-text"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

import React from "react";
import {
  Settings,
  Moon,
  Sun,
  Bell,
  Shield,
  LogOut,
  Trash2,
  Calendar,
  Users,
} from "lucide-react";
import { Button } from "../UI/Button";
import { Toggle } from "../UI/Toggle";
import { useStore } from "../../store/useStore";
import { Link } from "react-router-dom";

export const SettingsPage: React.FC = () => {
  const { darkMode, toggleDarkMode, currentUser, setCurrentUser } = useStore();

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-dark-bg" : "bg-white"} pb-20`}
    >
      <div className="px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Settings className="text-primary-purple mr-2" size={32} />
            <h1
              className={`text-2xl font-bold ${
                darkMode ? "text-dark-text" : "text-gray-900"
              }`}
            >
              Settings
            </h1>
          </div>
        </div>

        {/* User Profile Section */}
        {currentUser && (
          <div
            className={`p-6 rounded-xl border mb-6 ${
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-green to-primary-purple flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {currentUser.artistName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    darkMode ? "text-dark-text" : "text-gray-900"
                  }`}
                >
                  {currentUser.artistName}
                  {currentUser.isAdmin && (
                    <span className="ml-2 px-2 py-1 bg-primary-purple text-white text-xs rounded-full">
                      ADMIN
                    </span>
                  )}
                </h3>
                {currentUser.instagram && (
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    @{currentUser.instagram}
                  </p>
                )}
              </div>
            </div>
            <Link
              to="/profile"
              className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                darkMode
                  ? "hover:bg-gray-700 text-dark-text"
                  : "hover:bg-gray-100 text-gray-900"
              }`}
            >
              Edit Profile
            </Link>
          </div>
        )}

        {/* Admin Section */}
        {currentUser?.isAdmin && (
          <div
            className={`p-6 rounded-xl border mb-6 ${
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-dark-text" : "text-gray-900"
              }`}
            >
              Admin Tools
            </h2>
            <div className="space-y-3">
              <Link
                to="/admin"
                className={`w-full px-4 py-2 rounded-lg text-left transition-colors flex items-center ${
                  darkMode
                    ? "hover:bg-gray-700 text-dark-text"
                    : "hover:bg-gray-100 text-gray-900"
                }`}
              >
                <Users size={16} className="mr-2" />
                Artist Dashboard
              </Link>
              <Link
                to="/admin/events"
                className={`w-full px-4 py-2 rounded-lg text-left transition-colors flex items-center ${
                  darkMode
                    ? "hover:bg-gray-700 text-dark-text"
                    : "hover:bg-gray-100 text-gray-900"
                }`}
              >
                <Calendar size={16} className="mr-2" />
                Event Management
              </Link>
            </div>
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Appearance */}
          <div
            className={`p-6 rounded-xl border ${
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-dark-text" : "text-gray-900"
              }`}
            >
              Appearance
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                <div>
                  <p
                    className={`font-medium ${
                      darkMode ? "text-dark-text" : "text-gray-900"
                    }`}
                  >
                    Dark Mode
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Switch between light and dark themes
                  </p>
                </div>
              </div>
              <Toggle
                checked={darkMode}
                onChange={toggleDarkMode}
                color="purple"
              />
            </div>
          </div>

          {/* Notifications */}
          <div
            className={`p-6 rounded-xl border ${
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-dark-text" : "text-gray-900"
              }`}
            >
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell size={20} />
                  <div>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-dark-text" : "text-gray-900"
                      }`}
                    >
                      Performance Alerts
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Get notified when it's your turn to perform
                    </p>
                  </div>
                </div>
                <Toggle checked={true} onChange={() => {}} color="green" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell size={20} />
                  <div>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-dark-text" : "text-gray-900"
                      }`}
                    >
                      Message Notifications
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Get notified about new messages
                    </p>
                  </div>
                </div>
                <Toggle checked={true} onChange={() => {}} color="green" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell size={20} />
                  <div>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-dark-text" : "text-gray-900"
                      }`}
                    >
                      Event Updates
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Get notified about new events and updates
                    </p>
                  </div>
                </div>
                <Toggle checked={true} onChange={() => {}} color="green" />
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div
            className={`p-6 rounded-xl border ${
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-dark-text" : "text-gray-900"
              }`}
            >
              Privacy & Security
            </h2>
            <div className="space-y-3">
              <Button
                variant="ghost"
                icon={Shield}
                className="w-full justify-start"
              >
                Privacy Settings
              </Button>
              <Button
                variant="ghost"
                icon={Shield}
                className="w-full justify-start"
              >
                Blocked Users
              </Button>
              <Button
                variant="ghost"
                icon={Shield}
                className="w-full justify-start"
              >
                Data & Privacy
              </Button>
            </div>
          </div>

          {/* Account */}
          {currentUser && (
            <div
              className={`p-6 rounded-xl border ${
                darkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white"
              }`}
            >
              <h2
                className={`text-lg font-semibold mb-4 ${
                  darkMode ? "text-dark-text" : "text-gray-900"
                }`}
              >
                Account
              </h2>
              <div className="space-y-3">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  icon={LogOut}
                  className="w-full justify-start"
                >
                  Log Out
                </Button>
                <Button
                  variant="ghost"
                  icon={Trash2}
                  className="w-full justify-start text-red-500 hover:text-red-600"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* App Info */}
        <div className="mt-8 text-center">
          <p
            className={`text-sm ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            VYBE ON ON v1.0.0
          </p>
          <p
            className={`text-xs mt-1 ${
              darkMode ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Made with ❤️ for the music community
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Bell, Moon, Sun } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface HeaderProps {
  title: string;
  showNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showNotifications = true }) => {
  const { darkMode, toggleDarkMode, notifications } = useStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className={`sticky top-0 z-40 ${
      darkMode ? 'bg-dark-bg border-gray-800' : 'bg-white border-gray-200'
    } border-b px-4 py-3`}>
      <div className="flex items-center justify-between">
        <h1 className={`text-xl font-bold ${
          darkMode ? 'text-dark-text' : 'text-gray-900'
        }`}>
          {title}
        </h1>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors ${
              darkMode ? 'text-dark-text hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {showNotifications && (
            <button className={`relative p-2 rounded-full transition-colors ${
              darkMode ? 'text-dark-text hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
            }`}>
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
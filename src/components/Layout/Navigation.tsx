import React from 'react';
import { Home, Users, MessageCircle, Settings, Zap, Calendar } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { currentUser, darkMode } = useStore();

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'events', icon: Calendar, label: 'Events' },
    { id: 'lobby', icon: Users, label: 'Lobby' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'platforms', icon: Zap, label: 'Platforms' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 ${
      darkMode ? 'bg-dark-bg border-gray-800' : 'bg-white border-gray-200'
    } border-t z-50`}>
      <div className="flex justify-around items-center py-2">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
              activeTab === id
                ? `text-primary-green ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`
                : darkMode ? 'text-gray-400 hover:text-dark-text' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
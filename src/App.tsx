import React, { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { HomePage } from './components/Home/HomePage';
import { CheckInForm } from './components/CheckIn/CheckInForm';
import { EventLobby } from './components/Lobby/EventLobby';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { EventManagement } from './components/Admin/EventManagement';
import { EventsPage } from './components/Events/EventsPage';
import { MessagesPage } from './components/Messages/MessagesPage';
import { PlatformsPage } from './components/Platforms/PlatformsPage';
import { SettingsPage } from './components/Settings/SettingsPage';
import { ArtistProfile } from './components/Profile/ArtistProfile';
import { useStore } from './store/useStore';

function App() {
  const { darkMode, currentUser } = useStore();
  const [currentPage, setCurrentPage] = useState('home');

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'events':
        return <EventsPage />;
      case 'checkin':
        return (
          <CheckInForm
            onBack={() => setCurrentPage('home')}
            onComplete={() => setCurrentPage('lobby')}
          />
        );
      case 'lobby':
        return <EventLobby />;
      case 'admin':
        return <AdminDashboard />;
      case 'event-management':
        return <EventManagement onNavigate={setCurrentPage} />;
      case 'messages':
        return <MessagesPage />;
      case 'platforms':
        return <PlatformsPage />;
      case 'settings':
        return <SettingsPage onNavigate={setCurrentPage} />;
      case 'profile':
        return currentUser ? (
          <ArtistProfile artist={currentUser} isOwnProfile={true} />
        ) : (
          <HomePage onNavigate={setCurrentPage} />
        );
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'home':
        return 'ALL VYBES';
      case 'events':
        return 'Events';
      case 'checkin':
        return 'Check In';
      case 'lobby':
        return 'Event Lobby';
      case 'admin':
        return 'Admin Dashboard';
      case 'event-management':
        return 'Event Management';
      case 'messages':
        return 'Messages';
      case 'platforms':
        return 'Platforms';
      case 'settings':
        return 'Settings';
      case 'profile':
        return 'Profile';
      default:
        return 'ALL VYBES';
    }
  };

  const showNavigation = currentPage !== 'checkin' && currentPage !== 'event-management';
  const showHeader = currentPage !== 'home' && currentPage !== 'checkin';

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-dark-bg text-dark-text' : 'bg-white text-gray-900'}`}>
      {showHeader && <Header title={getPageTitle()} />}
      
      <main className={showNavigation ? 'pb-16' : ''}>
        {renderPage()}
      </main>
      
      {showNavigation && (
        <Navigation activeTab={currentPage} onTabChange={setCurrentPage} />
      )}
    </div>
  );
}

export default App;
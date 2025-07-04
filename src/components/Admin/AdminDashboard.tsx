import React, { useState } from 'react';
import { Search, Bell, Download, MoreVertical, Clock, Star, Zap, Users as UsersIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { Toggle } from '../UI/Toggle';
import { useStore } from '../../store/useStore';

export const AdminDashboard: React.FC = () => {
  const { users, checkIns, currentEvent, updateCheckIn, addNotification, darkMode } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedArtists, setExpandedArtists] = useState<Set<string>>(new Set());

  // Get checked-in artists for current event
  const eventCheckIns = checkIns.filter(checkIn => checkIn.eventId === currentEvent?.id);
  const checkedInArtists = users.filter(user => 
    eventCheckIns.some(checkIn => checkIn.userId === user.id)
  ).map(user => ({
    ...user,
    checkIn: eventCheckIns.find(checkIn => checkIn.userId === user.id)!
  })).sort((a, b) => a.checkIn.timestamp.getTime() - b.checkIn.timestamp.getTime()); // Sort by check-in time

  const filteredArtists = checkedInArtists.filter(artist =>
    artist.artistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleArtistExpanded = (artistId: string) => {
    const newExpanded = new Set(expandedArtists);
    if (newExpanded.has(artistId)) {
      newExpanded.delete(artistId);
    } else {
      newExpanded.add(artistId);
    }
    setExpandedArtists(newExpanded);
  };

  const handleToggleComplete = (checkInId: string, isComplete: boolean) => {
    updateCheckIn(checkInId, { isComplete });
  };

  const handleToggleSpecialEffects = (checkInId: string, specialEffects: boolean) => {
    updateCheckIn(checkInId, { specialEffects });
  };

  const handleMarkPerformed = (checkInId: string, userId: string) => {
    updateCheckIn(checkInId, { performed: true });
  };

  const handleReactivate = (checkInId: string) => {
    updateCheckIn(checkInId, { performed: false });
  };

  const handleSendNotification = (userId: string, artistName: string) => {
    addNotification({
      id: Date.now().toString(),
      userId,
      content: `${artistName}, please come to the DJ booth - it's your time to perform! 🎤`,
      timestamp: new Date(),
      read: false,
      type: 'performance',
    });
  };

  const handleUpdateGuestCount = (checkInId: string, guestCount: number) => {
    const isStar = guestCount >= 4;
    updateCheckIn(checkInId, { guestCount, isStar });
  };

  const handleUpdateSongCount = (checkInId: string, songCount: number) => {
    updateCheckIn(checkInId, { songCount });
  };

  const handleUpdateOtherContent = (checkInId: string, otherContent: string) => {
    updateCheckIn(checkInId, { otherContent });
  };

  const totalGuests = checkedInArtists.reduce((sum, a) => sum + a.checkIn.guestCount, 0);
  const starSupporters = checkedInArtists.filter(a => a.checkIn.isStar).length;
  const performedCount = checkedInArtists.filter(a => a.checkIn.performed).length;
  const completeCount = checkedInArtists.filter(a => a.checkIn.isComplete).length;

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ${diffInMinutes % 60}m ago`;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-white'} pb-20`}>
      <div className="px-6 py-8">
        {/* Live Event Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-500 font-bold text-sm">LIVE EVENT</span>
              </div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                Admin Dashboard
              </h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {currentEvent?.name} • {currentEvent?.venue}
              </p>
            </div>
            <Button variant="secondary" icon={Download} size="sm">
              Export Data
            </Button>
          </div>

          {/* Live Event Progress */}
          {currentEvent?.endDate && (
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
            } mb-6`}>
              <div className="flex justify-between text-sm mb-2">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Event Progress</span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Ends at {currentEvent.endDate.toLocaleTimeString()}
                </span>
              </div>
              <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className="h-3 bg-gradient-to-r from-primary-green to-primary-purple rounded-full"
                  style={{ 
                    width: `${Math.min(100, ((Date.now() - currentEvent.date.getTime()) / (currentEvent.endDate.getTime() - currentEvent.date.getTime())) * 100)}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                  {checkedInArtists.length}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Checked In
                </div>
              </div>
              <UsersIcon className="text-primary-green" size={24} />
            </div>
          </div>
          
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                  {performedCount}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Performed
                </div>
              </div>
              <Zap className="text-primary-purple" size={24} />
            </div>
          </div>
          
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                  {starSupporters}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Star Supporters
                </div>
              </div>
              <Star className="text-yellow-500" size={24} />
            </div>
          </div>
          
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                  {totalGuests}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Guests
                </div>
              </div>
              <UsersIcon className="text-primary-green" size={24} />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search artists..."
            icon={Search}
          />
        </div>

        {/* Performance Queue Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
            Performance Queue ({checkedInArtists.length - performedCount} remaining)
          </h2>
          <div className="flex items-center space-x-2">
            <Clock size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Ordered by check-in time
            </span>
          </div>
        </div>

        {/* Artists List - Collapsible */}
        <div className="space-y-3">
          {filteredArtists.map((artist, index) => {
            const isExpanded = expandedArtists.has(artist.id);
            
            return (
              <div
                key={artist.id}
                className={`rounded-xl border ${
                  darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                } ${artist.checkIn.performed ? 'opacity-60' : ''} transition-all duration-200`}
              >
                {/* Collapsed Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => toggleArtistExpanded(artist.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-green to-primary-purple flex items-center justify-center">
                          {artist.profileImage ? (
                            <img src={artist.profileImage} alt={artist.artistName} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-white font-bold text-sm">
                              {artist.artistName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        {!artist.checkIn.performed && (
                          <div className={`absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            darkMode ? 'bg-gray-700 text-dark-text' : 'bg-gray-100 text-gray-900'
                          }`}>
                            {index + 1}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                            {artist.artistName}
                          </h3>
                          {artist.checkIn.isStar && <span className="text-yellow-500 text-sm">⭐</span>}
                          {artist.checkIn.performed && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                            }`}>
                              ✓ PERFORMED
                            </span>
                          )}
                          {artist.checkIn.specialEffects && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary-purple text-white">
                              FX
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {artist.checkIn.guestCount} guests • {artist.checkIn.songCount} songs
                          </span>
                          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {getTimeAgo(artist.checkIn.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!artist.checkIn.performed && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendNotification(artist.id, artist.artistName);
                          }}
                          variant="ghost"
                          size="sm"
                          icon={Bell}
                        >
                          Alert
                        </Button>
                      )}
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="pt-4">
                      {/* Contact Info */}
                      <div className="mb-4">
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          @{artist.instagram} • {artist.phone} • {artist.email}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          Emergency: {artist.emergencyContact || 'Not provided'}
                        </p>
                      </div>

                      {/* Controls Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Guest Count */}
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-dark-text' : 'text-gray-700'
                          }`}>
                            Guests ({artist.checkIn.isStar ? 'STAR ⭐' : 'Regular'})
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={artist.checkIn.guestCount}
                            onChange={(e) => handleUpdateGuestCount(artist.checkIn.id, parseInt(e.target.value) || 0)}
                            className={`w-full px-3 py-2 border rounded-lg ${
                              darkMode ? 'border-gray-600 bg-gray-700 text-dark-text' : 'border-gray-300 bg-white'
                            }`}
                          />
                        </div>

                        {/* Song Count */}
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-dark-text' : 'text-gray-700'
                          }`}>
                            Songs
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={artist.checkIn.songCount}
                            onChange={(e) => handleUpdateSongCount(artist.checkIn.id, parseInt(e.target.value) || 1)}
                            className={`w-full px-3 py-2 border rounded-lg ${
                              darkMode ? 'border-gray-600 bg-gray-700 text-dark-text' : 'border-gray-300 bg-white'
                            }`}
                          />
                        </div>

                        {/* Status */}
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-dark-text' : 'text-gray-700'
                          }`}>
                            Status
                          </label>
                          <div className={`px-3 py-2 border rounded-lg ${
                            darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                          }`}>
                            <span className={`text-sm ${
                              artist.checkIn.isComplete 
                                ? 'text-green-500' 
                                : darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {artist.checkIn.isComplete ? '✓ Complete' : 'Incomplete'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Other Content */}
                      <div className="mb-4">
                        <label className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-dark-text' : 'text-gray-700'
                        }`}>
                          Performance Notes
                        </label>
                        <textarea
                          value={artist.checkIn.otherContent || ''}
                          onChange={(e) => handleUpdateOtherContent(artist.checkIn.id, e.target.value)}
                          placeholder="Special requests, performance details..."
                          rows={2}
                          className={`w-full px-3 py-2 border rounded-lg ${
                            darkMode ? 'border-gray-600 bg-gray-700 text-dark-text placeholder-gray-400' : 'border-gray-300 bg-white placeholder-gray-500'
                          }`}
                        />
                      </div>

                      {/* Toggles */}
                      <div className="flex flex-wrap gap-4 mb-4">
                        <Toggle
                          checked={artist.checkIn.isComplete}
                          onChange={(checked) => handleToggleComplete(artist.checkIn.id, checked)}
                          label="Complete (Paid/Verified)"
                          color="green"
                        />
                        <Toggle
                          checked={artist.checkIn.specialEffects}
                          onChange={(checked) => handleToggleSpecialEffects(artist.checkIn.id, checked)}
                          label="Special Effects"
                          color="purple"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        {!artist.checkIn.performed ? (
                          <>
                            <Button
                              onClick={() => handleMarkPerformed(artist.checkIn.id, artist.id)}
                              variant="primary"
                              size="sm"
                              glow
                            >
                              Mark Performed
                            </Button>
                            <Button
                              onClick={() => handleSendNotification(artist.id, artist.artistName)}
                              variant="secondary"
                              size="sm"
                              icon={Bell}
                            >
                              Send Alert
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                            >
                              Skip Turn
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => handleReactivate(artist.checkIn.id)}
                            variant="ghost"
                            size="sm"
                          >
                            Reactivate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredArtists.length === 0 && (
          <div className="text-center py-12">
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No artists found
            </h3>
            <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Artists will appear here as they check in
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
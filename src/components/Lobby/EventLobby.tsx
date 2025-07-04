import React, { useState } from 'react';
import { Search, Users, MessageCircle, UserPlus, ArrowLeft, Instagram, ExternalLink, Star, Heart } from 'lucide-react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { useStore } from '../../store/useStore';
import { ArtistProfile } from '../Profile/ArtistProfile';

export const EventLobby: React.FC = () => {
  const { users, checkIns, currentEvent, darkMode } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [followedArtists, setFollowedArtists] = useState<Set<string>>(new Set());

  // Get checked-in artists for current event
  const checkedInArtists = users.filter(user => 
    checkIns.some(checkIn => 
      checkIn.userId === user.id && 
      checkIn.eventId === currentEvent?.id
    )
  );

  const filteredArtists = checkedInArtists.filter(artist =>
    artist.artistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleArtistClick = (artistId: string) => {
    setSelectedArtist(artistId);
  };

  const handleBackToLobby = () => {
    setSelectedArtist(null);
  };

  const handleFollow = (artistId: string) => {
    const newFollowed = new Set(followedArtists);
    if (newFollowed.has(artistId)) {
      newFollowed.delete(artistId);
    } else {
      newFollowed.add(artistId);
    }
    setFollowedArtists(newFollowed);
  };

  const handleMessage = (artistId: string) => {
    // Navigate to messages with this artist
    console.log('Message artist:', artistId);
  };

  const openInstagram = (instagram: string) => {
    window.open(`https://instagram.com/${instagram}`, '_blank');
  };

  // If viewing a specific artist profile
  if (selectedArtist) {
    const artist = users.find(u => u.id === selectedArtist);
    if (artist) {
      return (
        <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-white'} pb-20`}>
          <div className="px-6 py-8">
            <Button
              onClick={handleBackToLobby}
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
              className="mb-6"
            >
              Back to Lobby
            </Button>
            <ArtistProfile 
              artist={artist} 
              isOwnProfile={false}
              onMessage={() => handleMessage(artist.id)}
              onFollow={() => handleFollow(artist.id)}
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-white'} pb-20`}>
      <div className="px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Users className="text-primary-green mr-2" size={32} />
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
              Event Lobby
            </h1>
          </div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentEvent?.name}
          </p>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
            darkMode ? 'bg-gray-800 text-primary-green' : 'bg-green-100 text-green-800'
          }`}>
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            {checkedInArtists.length} artists checked in
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

        {/* Artists Grid - Social Media Style */}
        <div className="space-y-4">
          {filteredArtists.map((artist) => {
            const checkIn = checkIns.find(c => c.userId === artist.id && c.eventId === currentEvent?.id);
            const isFollowed = followedArtists.has(artist.id);
            
            return (
              <div
                key={artist.id}
                className={`p-6 rounded-xl border ${
                  darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                } transition-all duration-200`}
              >
                {/* Artist Header */}
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="flex items-center space-x-4 cursor-pointer flex-1"
                    onClick={() => handleArtistClick(artist.id)}
                  >
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-green to-primary-purple flex items-center justify-center">
                      {artist.profileImage ? (
                        <img src={artist.profileImage} alt={artist.artistName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-xl">
                          {artist.artistName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-bold text-lg ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                          {artist.artistName}
                        </h3>
                        {checkIn?.isStar && (
                          <Star className="text-yellow-500" size={16} />
                        )}
                        {checkIn?.performed && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                          }`}>
                            ✓ PERFORMED
                          </span>
                        )}
                      </div>
                      
                      {artist.bio && (
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                          {artist.bio}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm">
                        {artist.instagram && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openInstagram(artist.instagram!);
                            }}
                            className="flex items-center space-x-1 text-pink-500 hover:text-pink-600"
                          >
                            <Instagram size={14} />
                            <span>@{artist.instagram}</span>
                          </button>
                        )}
                        <span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          Checked in {checkIn?.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollow(artist.id);
                    }}
                    variant={isFollowed ? 'secondary' : 'primary'}
                    size="sm"
                    icon={isFollowed ? Heart : UserPlus}
                    className={isFollowed ? 'text-red-500' : ''}
                  >
                    {isFollowed ? 'Following' : 'Follow'}
                  </Button>
                </div>

                {/* Artist Stats */}
                <div className={`grid grid-cols-3 gap-4 p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                } mb-4`}>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                      {Math.floor(Math.random() * 500) + 100}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Followers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                      {Math.floor(Math.random() * 50) + 5}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Events
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                      {checkIn?.guestCount || 0}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Guests Tonight
                    </div>
                  </div>
                </div>

                {/* Performance Info */}
                {checkIn && (
                  <div className={`p-3 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } mb-4`}>
                    <div className="flex items-center justify-between text-sm">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Tonight's Performance:
                      </span>
                      <span className={`font-medium ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                        {checkIn.songCount} song{checkIn.songCount !== 1 ? 's' : ''}
                        {checkIn.specialEffects && ' • Special FX'}
                      </span>
                    </div>
                    {checkIn.otherContent && (
                      <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        "{checkIn.otherContent}"
                      </p>
                    )}
                  </div>
                )}

                {/* Social Links */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {artist.instagram && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openInstagram(artist.instagram!);
                      }}
                      className={`px-3 py-1 rounded-full text-xs flex items-center space-x-1 ${
                        darkMode ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-100 text-pink-600'
                      }`}
                    >
                      <Instagram size={12} />
                      <span>Instagram</span>
                    </button>
                  )}
                  {artist.youtube && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://youtube.com/${artist.youtube}`, '_blank');
                      }}
                      className={`px-3 py-1 rounded-full text-xs flex items-center space-x-1 ${
                        darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      <ExternalLink size={12} />
                      <span>YouTube</span>
                    </button>
                  )}
                  {artist.tiktok && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://tiktok.com/@${artist.tiktok}`, '_blank');
                      }}
                      className={`px-3 py-1 rounded-full text-xs flex items-center space-x-1 ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <ExternalLink size={12} />
                      <span>TikTok</span>
                    </button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMessage(artist.id);
                    }}
                    variant="secondary"
                    size="sm"
                    icon={MessageCircle}
                    className="flex-1"
                  >
                    Message
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArtistClick(artist.id);
                    }}
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredArtists.length === 0 && (
          <div className="text-center py-12">
            <Users className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} size={48} />
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchTerm ? 'No artists found' : 'No artists checked in yet'}
            </h3>
            <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {searchTerm ? 'Try a different search term' : 'Artists will appear here as they check in'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
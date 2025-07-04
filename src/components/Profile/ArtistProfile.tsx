import React, { useState } from 'react';
import { Instagram, MessageCircle, UserPlus, ExternalLink, Edit3, Camera, Youtube, Music, Heart, Star } from 'lucide-react';
import { Button } from '../UI/Button';
import { useStore } from '../../store/useStore';
import { User } from '../../types';

interface ArtistProfileProps {
  artist: User;
  isOwnProfile?: boolean;
  onMessage?: () => void;
  onFollow?: () => void;
}

export const ArtistProfile: React.FC<ArtistProfileProps> = ({
  artist,
  isOwnProfile = false,
  onMessage,
  onFollow,
}) => {
  const { darkMode } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const openInstagram = () => {
    if (artist.instagram) {
      window.open(`https://instagram.com/${artist.instagram}`, '_blank');
    }
  };

  const openYouTube = () => {
    if (artist.youtube) {
      window.open(`https://youtube.com/${artist.youtube}`, '_blank');
    }
  };

  const openTikTok = () => {
    if (artist.tiktok) {
      window.open(`https://tiktok.com/@${artist.tiktok}`, '_blank');
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollow?.();
  };

  // Mock stats
  const stats = {
    followers: Math.floor(Math.random() * 1000) + 200,
    following: Math.floor(Math.random() * 500) + 50,
    events: Math.floor(Math.random() * 25) + 5,
    performances: Math.floor(Math.random() * 15) + 3,
  };

  return (
    <div className={`${darkMode ? 'bg-dark-bg' : 'bg-white'} pb-20`}>
      {/* Profile Header */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-r from-primary-green to-primary-purple" />
        <div className="absolute -bottom-16 left-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center overflow-hidden">
              {artist.profileImage ? (
                <img src={artist.profileImage} alt={artist.artistName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-gray-600">
                  {artist.artistName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {isOwnProfile && (
              <button className="absolute bottom-2 right-2 w-8 h-8 bg-primary-green rounded-full flex items-center justify-center">
                <Camera size={16} className="text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="pt-20 px-6">
        {/* Profile Info */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                {artist.artistName}
              </h1>
              <Star className="text-yellow-500" size={20} />
            </div>
            {artist.bio && (
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                {artist.bio}
              </p>
            )}
            
            {/* Social handles */}
            <div className="flex flex-wrap gap-2 mb-4">
              {artist.instagram && (
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  @{artist.instagram}
                </span>
              )}
              {artist.youtube && (
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  • YouTube: {artist.youtube}
                </span>
              )}
              {artist.tiktok && (
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  • TikTok: @{artist.tiktok}
                </span>
              )}
            </div>
          </div>
          
          {isOwnProfile && (
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="ghost"
              icon={Edit3}
              size="sm"
            >
              Edit
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        {!isOwnProfile && (
          <div className="flex space-x-3 mb-8">
            <Button
              onClick={handleFollow}
              variant={isFollowing ? 'secondary' : 'primary'}
              icon={isFollowing ? Heart : UserPlus}
              className={`flex-1 ${isFollowing ? 'text-red-500' : ''}`}
              glow={!isFollowing}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
            <Button
              onClick={onMessage}
              variant="secondary"
              icon={MessageCircle}
              className="flex-1"
            >
              Message
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className={`grid grid-cols-4 gap-4 p-6 rounded-xl ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
        } mb-8`}>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
              {stats.followers}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Followers
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
              {stats.following}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Following
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
              {stats.events}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Events
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
              {stats.performances}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Performances
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4 mb-8">
          {artist.instagram && (
            <button
              onClick={openInstagram}
              className={`w-full p-4 rounded-xl border ${
                darkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              } flex items-center justify-between transition-colors`}
            >
              <div className="flex items-center">
                <Instagram className="text-pink-500 mr-3" size={24} />
                <div className="text-left">
                  <span className={`font-medium ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                    Instagram
                  </span>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    @{artist.instagram}
                  </p>
                </div>
              </div>
              <ExternalLink size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            </button>
          )}

          {artist.youtube && (
            <button
              onClick={openYouTube}
              className={`w-full p-4 rounded-xl border ${
                darkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              } flex items-center justify-between transition-colors`}
            >
              <div className="flex items-center">
                <Youtube className="text-red-500 mr-3" size={24} />
                <div className="text-left">
                  <span className={`font-medium ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                    YouTube
                  </span>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {artist.youtube}
                  </p>
                </div>
              </div>
              <ExternalLink size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            </button>
          )}

          {artist.tiktok && (
            <button
              onClick={openTikTok}
              className={`w-full p-4 rounded-xl border ${
                darkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              } flex items-center justify-between transition-colors`}
            >
              <div className="flex items-center">
                <Music className="text-gray-900 mr-3" size={24} />
                <div className="text-left">
                  <span className={`font-medium ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                    TikTok
                  </span>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    @{artist.tiktok}
                  </p>
                </div>
              </div>
              <ExternalLink size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            </button>
          )}
        </div>

        {/* Twitch Embed */}
        {artist.twitchEmbed && (
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
              Live Stream
            </h3>
            <div className="aspect-video rounded-xl overflow-hidden bg-gray-900">
              <iframe
                src={artist.twitchEmbed}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className={`p-6 rounded-xl ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
        } mb-8`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-green rounded-full" />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Performed at Orlando Cypher Live
              </span>
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                2 hours ago
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-purple rounded-full" />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Gained 15 new followers
              </span>
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                1 day ago
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Achieved Star Supporter status
              </span>
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                3 days ago
              </span>
            </div>
          </div>
        </div>

        {/* Performance History */}
        <div className={`p-6 rounded-xl ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
            Performance History
          </h3>
          <div className="space-y-4">
            {[
              { event: 'Orlando Cypher Live', date: 'Tonight', status: 'performed' },
              { event: 'Miami Bass Collective', date: 'Last Week', status: 'star' },
              { event: 'Tampa R&B Sessions', date: '2 weeks ago', status: 'regular' },
            ].map((performance, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                    {performance.event}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {performance.date}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  performance.status === 'performed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : performance.status === 'star'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {performance.status === 'performed' ? '✓ Performed' : 
                   performance.status === 'star' ? '⭐ Star' : 'Regular'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
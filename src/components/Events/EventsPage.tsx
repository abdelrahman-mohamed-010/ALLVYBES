import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Search, Filter, Star, ArrowLeft, QrCode } from 'lucide-react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { useStore } from '../../store/useStore';
import { Event } from '../../types';

export const EventsPage: React.FC = () => {
  const { events, darkMode, setCurrentEvent } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'live' | 'upcoming'>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'live' && event.isLive) ||
                         (filterType === 'upcoming' && !event.isLive && event.date > new Date());
    
    return matchesSearch && matchesFilter;
  });

  const liveEvents = events.filter(e => e.isLive);
  const upcomingEvents = events.filter(e => !e.isLive && e.date > new Date());

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setCurrentEvent(event);
  };

  const handleBackToList = () => {
    setSelectedEvent(null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getEventStatus = (event: Event) => {
    if (event.isLive) return 'LIVE NOW';
    if (event.date > new Date()) return 'UPCOMING';
    return 'ENDED';
  };

  const getStatusColor = (event: Event) => {
    if (event.isLive) return 'text-red-500 bg-red-100 dark:bg-red-900/30';
    if (event.date > new Date()) return 'text-green-500 bg-green-100 dark:bg-green-900/30';
    return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
  };

  // Event Detail View
  if (selectedEvent) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-white'} pb-20`}>
        <div className="px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={handleBackToList}
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
            >
              Back to Events
            </Button>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEvent)}`}>
              {getEventStatus(selectedEvent)}
            </span>
          </div>

          {/* Event Hero */}
          <div className="relative mb-8">
            {selectedEvent.image && (
              <div className="w-full h-48 rounded-2xl overflow-hidden mb-6">
                <img src={selectedEvent.image} alt={selectedEvent.name} className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="text-center">
              <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                {selectedEvent.name}
              </h1>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                {selectedEvent.description}
              </p>
              
              {selectedEvent.isLive && (
                <div className="flex items-center justify-center mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2" />
                  <span className="text-red-500 font-bold">LIVE NOW</span>
                </div>
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className={`p-6 rounded-xl border mb-6 ${
            darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
              Event Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="text-primary-green" size={20} />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                    {formatDate(selectedEvent.date)}
                  </p>
                  {selectedEvent.endDate && (
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Ends at {selectedEvent.endDate.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="text-primary-purple" size={20} />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                    {selectedEvent.venue || selectedEvent.location}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedEvent.venue ? selectedEvent.location : 'Location'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Users className="text-primary-green" size={20} />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                    {selectedEvent.checkedInCount} / {selectedEvent.capacity || '∞'}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Artists Checked In
                  </p>
                </div>
              </div>
              
              {selectedEvent.price && (
                <div className="flex items-center space-x-3">
                  <span className="text-primary-green font-bold text-xl">${selectedEvent.price}</span>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                      Entry Fee
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Per Artist
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Registration Requirements */}
          <div className={`p-6 rounded-xl border mb-6 ${
            darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
              Registration Requirements
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-green rounded-full" />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Artist Name (Stage Name)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-green rounded-full" />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Instagram Handle (Required)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-purple rounded-full" />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Phone Number (Optional)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-purple rounded-full" />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Email Address (Optional)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-purple rounded-full" />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Emergency Contact (Recommended)
                </span>
              </div>
            </div>
          </div>

          {/* Performance Info */}
          <div className={`p-6 rounded-xl border mb-6 ${
            darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
              Performance Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className={`font-medium mb-2 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                  Star Supporter Status
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Bring 4+ guests to become a Star Supporter and get priority performance slots
                </p>
              </div>
              <div>
                <h4 className={`font-medium mb-2 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                  Song Limit
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Default 1 song per artist. Star Supporters may perform additional songs
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {selectedEvent.tags.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                Event Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedEvent.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {selectedEvent.isLive ? (
              <Button
                variant="primary"
                size="lg"
                icon={QrCode}
                glow
                className="w-full"
              >
                Join Live Event
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="lg"
                icon={Calendar}
                className="w-full"
              >
                Set Reminder
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
            >
              Share Event
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-white'} pb-20`}>
      <div className="px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="text-primary-purple mr-2" size={32} />
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
              Events
            </h1>
          </div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Discover live music events and performances
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2" />
              <span className={`text-sm font-medium ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                {liveEvents.length} Live Now
              </span>
            </div>
          </div>
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center">
              <Calendar size={16} className="text-primary-green mr-2" />
              <span className={`text-sm font-medium ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                {upcomingEvents.length} Upcoming
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4 mb-6">
          <Input
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search events, locations, or genres..."
            icon={Search}
          />
          
          <div className="flex space-x-2">
            {['all', 'live', 'upcoming'].map((filter) => (
              <Button
                key={filter}
                onClick={() => setFilterType(filter as any)}
                variant={filterType === filter ? 'primary' : 'ghost'}
                size="sm"
                className="capitalize"
              >
                {filter === 'all' ? 'All Events' : filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => handleEventClick(event)}
              className={`p-6 rounded-xl border cursor-pointer ${
                darkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-white hover:bg-gray-50'
              } transition-all duration-200 hover:scale-[1.02]`}
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                      {event.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event)}`}>
                      {getEventStatus(event)}
                    </span>
                  </div>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                    {event.description}
                  </p>
                </div>
                {event.image && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden ml-4">
                    <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Clock size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {formatDate(event.date)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {event.venue ? `${event.venue}, ${event.location}` : event.location}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {event.checkedInCount}/{event.capacity || '∞'} attending
                  </span>
                </div>
                
                {event.price && (
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${darkMode ? 'text-primary-green' : 'text-primary-green'}`}>
                      ${event.price}
                    </span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Progress Bar for Live Events */}
              {event.isLive && event.endDate && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Event Progress</span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Ends {event.endDate.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="h-2 bg-gradient-to-r from-primary-green to-primary-purple rounded-full"
                      style={{ 
                        width: `${Math.min(100, ((Date.now() - event.date.getTime()) / (event.endDate.getTime() - event.date.getTime())) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {event.isLive && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-red-500">LIVE</span>
                    </div>
                  )}
                </div>
                
                <Button
                  variant={event.isLive ? 'primary' : 'secondary'}
                  size="sm"
                  glow={event.isLive}
                >
                  {event.isLive ? 'Join Event' : 'View Details'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} size={48} />
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No events found
            </h3>
            <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {searchTerm ? 'Try a different search term' : 'Check back later for new events'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
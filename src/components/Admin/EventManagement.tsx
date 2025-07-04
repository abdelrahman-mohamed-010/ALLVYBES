import React, { useState } from "react";
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Edit3,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import { useStore } from "../../store/useStore";
import { Event } from "../../types";
import { useNavigate } from "react-router-dom";

export const EventManagement: React.FC = () => {
  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    darkMode,
    setCurrentEvent,
  } = useStore();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    endDate: "",
    location: "",
    venue: "",
    capacity: "",
    price: "",
    tags: "",
    image: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      date: "",
      endDate: "",
      location: "",
      venue: "",
      capacity: "",
      price: "",
      tags: "",
      image: "",
    });
    setShowCreateForm(false);
    setEditingEvent(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.date || !formData.location) return;

    const eventData: Event = {
      id: editingEvent?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      date: new Date(formData.date),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      location: formData.location,
      venue: formData.venue,
      qrId: `${formData.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      isActive: false,
      isLive: false,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      checkedInCount: 0,
      image: formData.image,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      price: formData.price ? parseFloat(formData.price) : undefined,
      createdAt: editingEvent?.createdAt || new Date(),
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }

    resetForm();
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description || "",
      date: event.date.toISOString().slice(0, 16),
      endDate: event.endDate?.toISOString().slice(0, 16) || "",
      location: event.location,
      venue: event.venue || "",
      capacity: event.capacity?.toString() || "",
      price: event.price?.toString() || "",
      tags: event.tags.join(", "),
      image: event.image || "",
    });
    setShowCreateForm(true);
  };

  const handleDelete = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEvent(eventId);
    }
  };

  const toggleEventStatus = (event: Event) => {
    updateEvent(event.id, {
      isLive: !event.isLive,
      isActive: !event.isLive ? true : event.isActive,
    });
  };

  const handleEventClick = (event: Event) => {
    if (event.isLive) {
      setCurrentEvent(event);
      setSelectedEvent(event);
    }
  };

  const handleBackToList = () => {
    setSelectedEvent(null);
  };

  const handleGoToAdmin = () => {
    if (selectedEvent) {
      setCurrentEvent(selectedEvent);
      navigate("/admin");
    }
  };

  // If viewing a specific live event
  if (selectedEvent && selectedEvent.isLive) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-dark-bg" : "bg-white"} pb-20`}
      >
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleBackToList}
                variant="ghost"
                size="sm"
                icon={ArrowLeft}
              >
                Back to Events
              </Button>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-500 font-bold text-sm">
                    LIVE EVENT
                  </span>
                </div>
                <h2
                  className={`text-2xl font-bold ${
                    darkMode ? "text-dark-text" : "text-gray-900"
                  }`}
                >
                  {selectedEvent.name}
                </h2>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {selectedEvent.venue} • {selectedEvent.location}
                </p>
              </div>
            </div>
            <Button onClick={handleGoToAdmin} variant="primary" size="sm" glow>
              Go to Admin Dashboard
            </Button>
          </div>

          {/* Event Details */}
          <div
            className={`p-6 rounded-xl border mb-6 ${
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    darkMode ? "text-dark-text" : "text-gray-900"
                  }`}
                >
                  Event Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {selectedEvent.date.toLocaleDateString()} at{" "}
                      {selectedEvent.date.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {selectedEvent.venue}, {selectedEvent.location}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={16} />
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {selectedEvent.checkedInCount}/
                      {selectedEvent.capacity || "∞"} checked in
                    </span>
                  </div>
                  {selectedEvent.price && (
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm font-medium ${
                          darkMode ? "text-primary-green" : "text-primary-green"
                        }`}
                      >
                        ${selectedEvent.price} entry
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    darkMode ? "text-dark-text" : "text-gray-900"
                  }`}
                >
                  Description
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {selectedEvent.description}
                </p>

                {selectedEvent.tags.length > 0 && (
                  <div className="mt-4">
                    <h4
                      className={`text-sm font-medium mb-2 ${
                        darkMode ? "text-dark-text" : "text-gray-700"
                      }`}
                    >
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs ${
                            darkMode
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live Event Progress */}
          {selectedEvent.endDate && (
            <div
              className={`p-4 rounded-xl ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-gray-50 border border-gray-200"
              } mb-6`}
            >
              <div className="flex justify-between text-sm mb-2">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Event Progress
                </span>
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Ends at {selectedEvent.endDate.toLocaleTimeString()}
                </span>
              </div>
              <div
                className={`w-full h-3 rounded-full ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div
                  className="h-3 bg-gradient-to-r from-primary-green to-primary-purple rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      ((Date.now() - selectedEvent.date.getTime()) /
                        (selectedEvent.endDate.getTime() -
                          selectedEvent.date.getTime())) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleGoToAdmin}
              variant="primary"
              className="w-full"
              glow
            >
              Admin Dashboard
            </Button>
            <Button
              onClick={() => toggleEventStatus(selectedEvent)}
              variant="danger"
              className="w-full"
            >
              End Event
            </Button>
            <Button
              onClick={() => handleEdit(selectedEvent)}
              variant="secondary"
              className="w-full"
              icon={Edit3}
            >
              Edit Event
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-dark-bg" : "bg-white"} pb-20`}
      >
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-dark-text" : "text-gray-900"
              }`}
            >
              {editingEvent ? "Edit Event" : "Create New Event"}
            </h2>
            <Button onClick={resetForm} variant="ghost" size="sm">
              Cancel
            </Button>
          </div>

          <div className="space-y-6">
            <Input
              label="Event Name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              placeholder="Orlando Cypher Live"
              required
            />

            <div className="space-y-1">
              <label
                className={`block text-sm font-medium ${
                  darkMode ? "text-dark-text" : "text-gray-700"
                }`}
              >
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Event description..."
                rows={3}
                className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-dark-text
                  focus:ring-2 focus:ring-primary-green focus:border-transparent
                  placeholder-gray-500 dark:placeholder-gray-400`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date & Time"
                type="datetime-local"
                value={formData.date}
                onChange={(value) => setFormData({ ...formData, date: value })}
                required
              />

              <Input
                label="End Date & Time"
                type="datetime-local"
                value={formData.endDate}
                onChange={(value) =>
                  setFormData({ ...formData, endDate: value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Location"
                value={formData.location}
                onChange={(value) =>
                  setFormData({ ...formData, location: value })
                }
                placeholder="Downtown Orlando"
                icon={MapPin}
                required
              />

              <Input
                label="Venue"
                value={formData.venue}
                onChange={(value) => setFormData({ ...formData, venue: value })}
                placeholder="The Underground"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Capacity"
                type="number"
                value={formData.capacity}
                onChange={(value) =>
                  setFormData({ ...formData, capacity: value })
                }
                placeholder="150"
                icon={Users}
              />

              <Input
                label="Price ($)"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(value) => setFormData({ ...formData, price: value })}
                placeholder="15.00"
              />

              <Input
                label="Tags (comma separated)"
                value={formData.tags}
                onChange={(value) => setFormData({ ...formData, tags: value })}
                placeholder="Hip-Hop, Live, Underground"
              />
            </div>

            <Input
              label="Event Image URL"
              value={formData.image}
              onChange={(value) => setFormData({ ...formData, image: value })}
              placeholder="https://images.pexels.com/..."
            />

            <div className="flex space-x-4">
              <Button
                onClick={handleSubmit}
                variant="primary"
                size="lg"
                className="flex-1"
                glow
              >
                {editingEvent ? "Update Event" : "Create Event"}
              </Button>
              <Button onClick={resetForm} variant="secondary" size="lg">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-dark-bg" : "bg-white"} pb-20`}
    >
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-dark-text" : "text-gray-900"
              }`}
            >
              Event Management
            </h2>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Create and manage your events
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            variant="primary"
            icon={Plus}
            glow
          >
            New Event
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div
            className={`p-4 rounded-xl ${
              darkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <div
              className={`text-2xl font-bold ${
                darkMode ? "text-dark-text" : "text-gray-900"
              }`}
            >
              {events.length}
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Events
            </div>
          </div>
          <div
            className={`p-4 rounded-xl ${
              darkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <div
              className={`text-2xl font-bold ${
                darkMode ? "text-dark-text" : "text-gray-900"
              }`}
            >
              {events.filter((e) => e.isLive).length}
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Live Now
            </div>
          </div>
          <div
            className={`p-4 rounded-xl ${
              darkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <div
              className={`text-2xl font-bold ${
                darkMode ? "text-dark-text" : "text-gray-900"
              }`}
            >
              {events.filter((e) => e.date > new Date() && !e.isLive).length}
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Upcoming
            </div>
          </div>
          <div
            className={`p-4 rounded-xl ${
              darkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <div
              className={`text-2xl font-bold ${
                darkMode ? "text-dark-text" : "text-gray-900"
              }`}
            >
              {events.reduce((sum, e) => sum + e.checkedInCount, 0)}
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Check-ins
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => handleEventClick(event)}
              className={`p-6 rounded-xl border ${
                darkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white"
              } ${
                event.isLive
                  ? "cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3
                      className={`text-xl font-bold ${
                        darkMode ? "text-dark-text" : "text-gray-900"
                      }`}
                    >
                      {event.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.isLive
                          ? "text-red-500 bg-red-100 dark:bg-red-900/30"
                          : event.date > new Date()
                          ? "text-green-500 bg-green-100 dark:bg-green-900/30"
                          : "text-gray-500 bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      {event.isLive
                        ? "LIVE"
                        : event.date > new Date()
                        ? "UPCOMING"
                        : "ENDED"}
                    </span>
                    {event.isLive && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          darkMode
                            ? "bg-primary-green/20 text-primary-green"
                            : "bg-primary-green/10 text-primary-green"
                        }`}
                      >
                        Click to view
                      </span>
                    )}
                  </div>
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-2`}
                  >
                    {event.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{event.date.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>
                        {event.checkedInCount}/{event.capacity || "∞"}
                      </span>
                    </div>
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

              <div className="flex space-x-3">
                <Button
                  onClick={() => {
                    toggleEventStatus(event);
                  }}
                  variant={event.isLive ? "danger" : "primary"}
                  size="sm"
                >
                  {event.isLive ? "End Event" : "Go Live"}
                </Button>
                <Button
                  onClick={() => {
                    handleEdit(event);
                  }}
                  variant="ghost"
                  size="sm"
                  icon={Edit3}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    handleDelete(event.id);
                  }}
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar
              className={`mx-auto mb-4 ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`}
              size={48}
            />
            <h3
              className={`text-lg font-medium mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No events created yet
            </h3>
            <p
              className={`${darkMode ? "text-gray-500" : "text-gray-500"} mb-4`}
            >
              Create your first event to get started
            </p>
            <Button
              onClick={() => setShowCreateForm(true)}
              variant="primary"
              icon={Plus}
            >
              Create Event
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
  
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, MapPin, Clock, Share2, User } from 'lucide-react';
import API from '../services/api';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAttendees, setShowAttendees] = useState(false);
  const [isViewingEvent, setIsViewingEvent] = useState(true);

  // Smart Polling: Only poll when user is actively viewing event
  useEffect(() => {
    // Initial fetch
    fetchEventDetails();
    const userData = localStorage.getItem('userInfo');
    if (userData) {
      setUserInfo(JSON.parse(userData));
    }

    // Mark as viewing event
    setIsViewingEvent(true);

    // Smart polling: Only runs when isViewingEvent is true
    const interval = setInterval(() => {
      if (isViewingEvent) {
        fetchEventDetails();
        console.log('⏰ Smart poll: Fetching event details (every 45 seconds)');
      }
    }, 45000); // Poll every 45 seconds (safe for free tier)

    // Cleanup function
    return () => {
      setIsViewingEvent(false);
      clearInterval(interval);
    };
  }, []);

  // Stop polling when user navigates away
  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsViewingEvent(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      setIsViewingEvent(false);
    };
  }, []);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/api/events/${eventId}`);
      setEvent(data);
      
      // Fetch attendees
      try {
        const attendeesData = await API.get(`/api/events/${eventId}/attendees`);
        setAttendees(attendeesData.data || []);
      } catch (err) {
        console.error('Error fetching attendees:', err);
        // Not critical - continue without attendees
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      window.showToast('Failed to load event details', 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const shareText = `Check out this amazing event: ${event?.eventName}! Join me and register here.`;
    if (navigator.share) {
      navigator.share({
        title: event?.eventName,
        text: shareText,
        url: window.location.href,
      }).catch(err => console.log('Share failed:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      window.showToast('Event link copied to clipboard! 📋', 'success', 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#121212] pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Event not found</p>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const registrationDate = event?.registrationDeadline ? new Date(event.registrationDeadline) : null;
  const eventDate = event?.startDateTime ? new Date(event.startDateTime) : null;
  const endDate = event?.endDateTime ? new Date(event.endDateTime) : null;
  const isRegistrationOpen = registrationDate ? new Date() < registrationDate : true;

  return (
    <div className="min-h-screen bg-[#121212] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Event Details */}
          <div className="md:col-span-2">
            {/* Event Banner/Hero */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8 mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">{event.eventName}</h1>
              <p className="text-gray-300 text-lg mb-6">{event.description}</p>

              {/* Event Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-gray-400 text-sm">Capacity</p>
                  <p className="text-2xl font-bold text-pink-400">{event.capacity || '∞'}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className={`text-2xl font-bold ${event.status === 'live' ? 'text-green-400' : event.status === 'upcoming' ? 'text-blue-400' : 'text-gray-400'}`}>
                    {event.status?.toUpperCase() || 'N/A'}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-gray-400 text-sm">Filled</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {event.capacity && event.registrationCount ? Math.round((event.registrationCount / event.capacity) * 100) : '0'}%
                  </p>
                </div>
              </div>
            </div>

            {/* Event Information */}
            <div className="space-y-6 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Event Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Date & Time</p>
                      <p className="text-white font-semibold">
                        {eventDate ? (
                          <>
                            {eventDate.toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })} at {eventDate.toLocaleTimeString()}
                            {endDate && ` to ${endDate.toLocaleTimeString()}`}
                          </>
                        ) : 'Date not available'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Location</p>
                      <p className="text-white font-semibold">
                        {event.locationType === 'online' ? '🌐 Online Event' : event.locationValue || 'TBD'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Registration Deadline</p>
                      <p className="text-white font-semibold">
                        {registrationDate ? registrationDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }) : 'No deadline'}
                      </p>
                      {!isRegistrationOpen && (
                        <p className="text-red-400 text-sm mt-2">Registration closed</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">About This Event</h3>
                <p className="text-gray-300 leading-relaxed">{event.description}</p>
              </div>
            </div>

            {/* Attendees List */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Attendees ({attendees.length})
                </h3>
                <button
                  onClick={() => setShowAttendees(!showAttendees)}
                  className="text-cyan-400 hover:text-cyan-300 transition"
                >
                  {showAttendees ? 'Hide' : 'Show All'}
                </button>
              </div>

              {showAttendees && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {attendees.map((attendee, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate">{attendee.fullName}</p>
                        <p className="text-gray-400 text-xs truncate">{attendee.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - User Info & Actions */}
          <div className="md:col-span-1">
            {/* Your Details */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 sticky top-32">
              <h3 className="text-lg font-bold text-white mb-4">Your Details</h3>
              
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400 flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-semibold">{userInfo?.fullName}</p>
                <p className="text-gray-400 text-sm truncate">{userInfo?.email}</p>
                <p className="text-cyan-400 text-xs mt-2 bg-cyan-400/10 px-2 py-1 rounded inline-block">
                  ✓ Registered
                </p>
              </div>

              {/* QR Code Display */}
              <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-cyan-400 text-sm">
                  🎟️ QR code will be available after you check in to the event.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleShare}
                  className="w-full px-4 py-3 bg-pink-500/20 border border-pink-500 text-pink-400 rounded-lg hover:bg-pink-500/30 transition flex items-center justify-center gap-2 font-semibold"
                >
                  <Share2 className="w-4 h-4" />
                  Share Event
                </button>

                <button
                  onClick={() => navigate('/events')}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 transition font-semibold"
                >
                  Browse More Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;

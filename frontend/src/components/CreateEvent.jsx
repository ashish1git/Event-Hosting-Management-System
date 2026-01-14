import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Shield,
  Tag,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Edit
} from 'lucide-react';

const CreateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [eventData, setEventData] = useState({
    eventName: '',
    description: '',
    coverImage: '',
    calendarType: 'personal',
    visibility: 'public',
    startDateTime: '',
    endDateTime: '',
    timeZone: 'GMT+05:30',
    locationType: 'offline',
    locationValue: '',
    theme: 'minimal',
    ticketType: 'free',
    ticketPrice: 0,
    requireApproval: false,
    capacity: ''
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/events/${id}`);

      // Format dates for input fields
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset() * 60000;
        return (new Date(date - offset)).toISOString().slice(0, 16);
      };

      setEventData({
        ...data,
        startDateTime: formatDate(data.startDateTime),
        endDateTime: formatDate(data.endDateTime),
        capacity: data.capacity === null ? '' : data.capacity
      });
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch event details', err);
      setError('Failed to load event details.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTicketTypeChange = (value) => {
    setEventData(prev => ({ ...prev, ticketType: value, ticketPrice: value === 'free' ? 0 : prev.ticketPrice }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    const payload = {
      ...eventData,
      capacity: eventData.capacity === '' ? null : Number(eventData.capacity),
      ticketPrice: Number(eventData.ticketPrice)
    };

    console.log(`--- ${isEditMode ? 'Updating' : 'Submitting'} Event ---`);
    console.log('Payload:', payload);

    if (!window.confirm(`Are you sure you want to ${isEditMode ? 'update' : 'publish'} this event?`)) {
        setLoading(false);
        return;
    }

    try {
      let res;
      if (isEditMode) {
        res = await axios.put(`/api/admin/events/${id}`, payload);
        setMessage('Event updated successfully!');
      } else {
        res = await axios.post('/api/admin/events', payload);
        setMessage('Event created and published successfully!');
      }

      console.log('Response:', res);
      console.log('Event Data:', res.data);

      setTimeout(() => {
        navigate('/admin');
      }, 1500);

    } catch (err) {
      console.error('Submission Error:', err);
      if (err.response) {
          console.error('Error Response Data:', err.response.data);
          console.error('Error Status:', err.response.status);
          setError(err.response.data.message || 'Operation failed.');
      } else {
          setError(err.message || 'Operation failed.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] pt-32 pb-20 px-6 font-sans">
      {/* Background Orbs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-pink-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 mb-2">
              {isEditMode ? <Edit size={20} /> : <PlusCircle size={20} />}
              <span className="uppercase tracking-[0.2em] text-xs font-bold">Admin Portal</span>
            </div>
            <h1 className="text-5xl font-black text-white">{isEditMode ? 'Edit Event' : 'Create New Event'}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 text-black font-bold shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
            >
              {loading ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update Event' : 'Publish Event')}
            </button>
          </div>
        </motion.div>

        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-green-500/10 border border-green-500/50 rounded-2xl flex items-center space-x-3 text-green-400"
          >
            <CheckCircle2 size={20} />
            <span className="font-medium">{message}</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center space-x-3 text-red-400"
          >
            <AlertCircle size={20} />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Info Column */}
          <div className="lg:col-span-8 space-y-8">

            {/* General Information */}
            <section className="p-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-cyan-400/10 rounded-2xl">
                  <Tag className="text-cyan-400" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">General Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-widest">Event Name</label>
                  <input
                    type="text"
                    name="eventName"
                    value={eventData.eventName}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-400 transition-all outline-none placeholder:text-gray-600 font-medium"
                    placeholder="Grand Tech Unveiling 2026"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-widest">Description</label>
                  <textarea
                    name="description"
                    value={eventData.description}
                    onChange={handleChange}
                    rows="5"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-400 transition-all outline-none placeholder:text-gray-600 font-medium resize-none"
                    placeholder="Describe the cinematic experience..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-widest">Calendar Type</label>
                    <div className="relative">
                      <select
                        name="calendarType"
                        value={eventData.calendarType}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-400 transition-all outline-none appearance-none font-medium"
                      >
                        <option value="personal">Personal Event</option>
                        <option value="team">Team Collaboration</option>
                      </select>
                      <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-widest">Visibility</label>
                    <div className="relative">
                      <select
                        name="visibility"
                        value={eventData.visibility}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-400 transition-all outline-none appearance-none font-medium"
                      >
                        <option value="public">🌍 Public Event</option>
                        <option value="private">🔒 Private Portal</option>
                      </select>
                      <Globe size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Logistics */}
            <section className="p-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-purple-500/10 rounded-2xl">
                  <MapPin className="text-purple-500" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Date & Logistics</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-widest">Start Date/Time</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        name="startDateTime"
                        value={eventData.startDateTime}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-purple-500 transition-all outline-none font-medium custom-datetime-input"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-widest">End Date/Time</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        name="endDateTime"
                        value={eventData.endDateTime}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-purple-500 transition-all outline-none font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                    <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-widest">Location Type</label>
                    <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => setEventData(prev => ({ ...prev, locationType: 'offline' }))}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${eventData.locationType === 'offline' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        Physical
                      </button>
                      <button
                         type="button"
                         onClick={() => setEventData(prev => ({ ...prev, locationType: 'online' }))}
                         className={`flex-1 py-3 rounded-xl font-bold transition-all ${eventData.locationType === 'online' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        Digital
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-widest">
                      {eventData.locationType === 'offline' ? 'Venue Address' : 'Meeting Link'}
                    </label>
                    <input
                      type="text"
                      name="locationValue"
                      value={eventData.locationValue}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-purple-500 transition-all outline-none placeholder:text-gray-600 font-medium"
                      placeholder={eventData.locationType === 'offline' ? 'e.g. Oracle Park, San Francisco' : 'https://zoom.us/j/...'}
                      required
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">

            {/* Visuals */}
            <section className="p-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-pink-500/10 rounded-2xl">
                  <ImageIcon className="text-pink-500" size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">Cover Media</h2>
              </div>

              <div className="space-y-6">
                <div className="relative group aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 mb-4">
                  {eventData.coverImage ? (
                    <img src={eventData.coverImage} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 group-hover:text-gray-400 transition-colors">
                      <ImageIcon size={48} className="mb-2" />
                      <span className="text-xs uppercase font-bold tracking-widest">Media Preview</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-white/50 uppercase font-black">Ready for broadcast</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-widest">Image URL</label>
                  <input
                    type="text"
                    name="coverImage"
                    value={eventData.coverImage}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-xs focus:border-pink-500 transition-all outline-none font-medium"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>
            </section>

            {/* Admission Control */}
            <section className="p-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-orange-500/10 rounded-2xl">
                  <Shield className="text-orange-500" size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">Enrollment</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-widest text-center">Ticket Tier</label>
                  <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => handleTicketTypeChange('free')}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all ${eventData.ticketType === 'free' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      Free
                    </button>
                    <button
                       type="button"
                       onClick={() => handleTicketTypeChange('paid')}
                       className={`flex-1 py-3 rounded-xl font-bold transition-all ${eventData.ticketType === 'paid' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      Paid
                    </button>
                  </div>
                </div>

                {eventData.ticketType === 'paid' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-widest">Ticket Price ($)</label>
                    <input
                      type="number"
                      name="ticketPrice"
                      value={eventData.ticketPrice}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500 transition-all outline-none font-medium"
                      min="0"
                    />
                  </motion.div>
                )}

                <div>
                   <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-widest">Max Guests</label>
                   <div className="relative">
                    <input
                      type="number"
                      name="capacity"
                      value={eventData.capacity}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-400 transition-all outline-none placeholder:text-gray-700 font-medium"
                      placeholder="Unlimited"
                      min="1"
                    />
                    <Users size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                   </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">Gatekeeper Protocol</span>
                    <span className="text-[10px] text-gray-500 uppercase font-black">Approval required</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="requireApproval"
                      checked={eventData.requireApproval}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:bg-cyan-400 transition-all after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"></div>
                  </label>
                </div>
              </div>
            </section>
          </div>
        </form>
      </div>

      <style jsx="true">{`
        .custom-datetime-input::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default CreateEvent;

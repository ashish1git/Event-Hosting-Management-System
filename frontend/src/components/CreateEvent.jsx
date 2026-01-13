import React, { useState } from 'react';
import axios from 'axios';

const CreateEvent = () => {
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
    try {
        // In a real app, you'd get the token from auth state/context
        // For demo, we might need to login first or assume session.
        // I will assume I need to pass a token if I had one.
        // For now, I will just try to post.
        // NOTE: The backend requires constraints.
        // Capacity: "null" implies unlimited. If user leaves empty string, send null.

        const payload = {
            ...eventData,
            capacity: eventData.capacity === '' ? null : Number(eventData.capacity),
            ticketPrice: Number(eventData.ticketPrice)
        };

      // Mocking the auth header since we don't have a full login flow in this single page request
      // const config = { headers: { Authorization: `Bearer ${token}` } };

      // Since I haven't implemented the login page for the user yet, the request might fail 401.
      // But I will write the code as if it works, or I can add a temporary 'login' step if requested.
      // User asked for "Create Event page", so I'll focus on that.

      const res = await axios.post('/api/admin/events', payload);
      setMessage('Event created successfully!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-charcoal p-8">
        <div className="max-w-5xl mx-auto">
            <header className="mb-10 text-center relative">
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-bronze to-transparent opacity-50"></div>
                <h1 className="text-4xl text-bronze mb-2 tracking-wide font-serif">Create New Event</h1>
                <p className="text-parchment opacity-80 italic">Curate an unforgettable experience</p>
            </header>

            {message && <div className="mb-6 p-4 bg-forest border border-green-500 text-green-200 rounded">{message}</div>}
            {error && <div className="mb-6 p-4 bg-burgundy/20 border border-burgundy text-red-200 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Event Details Card */}
                    <div className="bg-forest p-6 rounded-lg border border-bronze/20 shadow-xl shadow-black/40">
                        <h2 className="text-xl text-bronze mb-4 border-b border-bronze/10 pb-2">Event Details</h2>

                        <div className="mb-4">
                            <label className="block text-parchment text-sm mb-1">Event Name</label>
                            <input
                                type="text"
                                name="eventName"
                                value={eventData.eventName}
                                onChange={handleChange}
                                className="w-full bg-charcoal border border-bronze/30 rounded p-3 text-parchment focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze transition-colors placeholder-gray-600"
                                placeholder="e.g. Annual Gala 2026"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-parchment text-sm mb-1">Description</label>
                            <textarea
                                name="description"
                                value={eventData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full bg-charcoal border border-bronze/30 rounded p-3 text-parchment focus:border-bronze focus:outline-none transition-colors placeholder-gray-600"
                                placeholder="Describe the essence of your event..."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-parchment text-sm mb-1">Calendar Type</label>
                                <select
                                    name="calendarType"
                                    value={eventData.calendarType}
                                    onChange={handleChange}
                                    className="w-full bg-charcoal border border-bronze/30 rounded p-3 text-parchment focus:border-bronze focus:outline-none appearance-none"
                                >
                                    <option value="personal">Personal Calendar</option>
                                    <option value="team">Team Calendar</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-parchment text-sm mb-1">Visibility</label>
                                <select
                                    name="visibility"
                                    value={eventData.visibility}
                                    onChange={handleChange}
                                    className="w-full bg-charcoal border border-bronze/30 rounded p-3 text-parchment focus:border-bronze focus:outline-none appearance-none"
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Date & Location Card */}
                    <div className="bg-forest p-6 rounded-lg border border-bronze/20 shadow-xl shadow-black/40">
                         <h2 className="text-xl text-bronze mb-4 border-b border-bronze/10 pb-2">Date & Location</h2>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                             <div>
                                <label className="block text-parchment text-sm mb-1">Start Date & Time</label>
                                <input
                                    type="datetime-local"
                                    name="startDateTime"
                                    value={eventData.startDateTime}
                                    onChange={handleChange}
                                    className="w-full bg-charcoal border border-bronze/30 rounded p-3 text-parchment focus:border-bronze focus:outline-none"
                                    required
                                />
                             </div>
                             <div>
                                <label className="block text-parchment text-sm mb-1">End Date & Time</label>
                                <input
                                    type="datetime-local"
                                    name="endDateTime"
                                    value={eventData.endDateTime}
                                    onChange={handleChange}
                                    className="w-full bg-charcoal border border-bronze/30 rounded p-3 text-parchment focus:border-bronze focus:outline-none"
                                    required
                                />
                             </div>
                         </div>

                        <div className="mb-4">
                             <label className="block text-parchment text-sm mb-1">Timezone</label>
                             <select
                                name="timeZone"
                                value={eventData.timeZone}
                                onChange={handleChange}
                                className="w-full bg-charcoal border border-bronze/30 rounded p-3 text-parchment focus:border-bronze focus:outline-none"
                             >
                                 <option value="GMT+05:30">GMT+05:30 (India Standard Time)</option>
                                 <option value="UTC">UTC</option>
                                 <option value="EST">EST</option>
                                 <option value="PST">PST</option>
                             </select>
                        </div>

                         <div className="mb-4">
                            <label className="block text-parchment text-sm mb-1">Location Type</label>
                             <div className="flex gap-4 mb-2">
                                 <label className="flex items-center cursor-pointer">
                                     <input
                                        type="radio"
                                        name="locationType"
                                        value="offline"
                                        checked={eventData.locationType === 'offline'}
                                        onChange={handleChange}
                                        className="text-bronze focus:ring-bronze bg-charcoal border-bronze/30"
                                     />
                                     <span className="ml-2 text-parchment">Offline</span>
                                 </label>
                                 <label className="flex items-center cursor-pointer">
                                     <input
                                        type="radio"
                                        name="locationType"
                                        value="online"
                                        checked={eventData.locationType === 'online'}
                                        onChange={handleChange}
                                        className="text-bronze focus:ring-bronze bg-charcoal border-bronze/30"
                                     />
                                     <span className="ml-2 text-parchment">Online</span>
                                 </label>
                             </div>
                             <input
                                type="text"
                                name="locationValue"
                                value={eventData.locationValue}
                                onChange={handleChange}
                                className="w-full bg-charcoal border border-bronze/30 rounded p-3 text-parchment focus:border-bronze focus:outline-none placeholder-gray-600"
                                placeholder={eventData.locationType === 'offline' ? "Enter address/venue" : "Enter meeting link"}
                                required
                            />
                         </div>
                    </div>
                </div>

                {/* Right Column - Settings & Media */}
                <div className="space-y-6">
                    {/* Media Card */}
                     <div className="bg-forest p-6 rounded-lg border border-bronze/20 shadow-xl shadow-black/40">
                        <h2 className="text-xl text-bronze mb-4 border-b border-bronze/10 pb-2">Cover Image</h2>
                        <div className="mb-4">
                            <label className="block text-parchment text-sm mb-1">Image URL</label>
                            <input
                                type="text"
                                name="coverImage"
                                value={eventData.coverImage}
                                onChange={handleChange}
                                className="w-full bg-charcoal border border-bronze/30 rounded p-3 text-parchment focus:border-bronze focus:outline-none text-sm placeholder-gray-600"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="h-40 bg-charcoal rounded border border-bronze/10 flex items-center justify-center overflow-hidden relative group">
                            {eventData.coverImage ? (
                                <img src={eventData.coverImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                            ) : (
                                <span className="text-gray-600 text-sm italic">Image Preview</span>
                            )}
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <span className="text-bronze text-sm">Preview only</span>
                            </div>
                        </div>
                    </div>

                    {/* Settings Card */}
                    <div className="bg-forest p-6 rounded-lg border border-bronze/20 shadow-xl shadow-black/40">
                         <h2 className="text-xl text-bronze mb-4 border-b border-bronze/10 pb-2">Configurations</h2>

                         <div className="mb-4">
                            <label className="block text-parchment text-sm mb-1">Theme</label>
                            <select
                                name="theme"
                                value={eventData.theme}
                                onChange={handleChange}
                                className="w-full bg-charcoal border border-bronze/30 rounded p-3 text-parchment focus:border-bronze focus:outline-none"
                             >
                                 <option value="minimal">Minimal</option>
                                 <option value="holiday">Holiday</option>
                                 <option value="abstract">Abstract</option>
                             </select>
                         </div>

                         <div className="mb-4">
                             <label className="block text-parchment text-sm mb-2">Ticket Type</label>
                             <div className="flex gap-2">
                                 <button
                                     type="button"
                                     onClick={() => handleTicketTypeChange('free')}
                                     className={`flex-1 py-2 px-4 rounded border ${eventData.ticketType === 'free' ? 'bg-bronze text-charcoal border-bronze font-bold' : 'bg-transparent text-parchment border-bronze/30 hover:border-bronze/60'}`}
                                 >
                                     Free
                                 </button>
                                 <button
                                     type="button"
                                     onClick={() => handleTicketTypeChange('paid')}
                                     className={`flex-1 py-2 px-4 rounded border ${eventData.ticketType === 'paid' ? 'bg-bronze text-charcoal border-bronze font-bold' : 'bg-transparent text-parchment border-bronze/30 hover:border-bronze/60'}`}
                                 >
                                     Paid
                                 </button>
                             </div>
                         </div>

                         {eventData.ticketType === 'paid' && (
                             <div className="mb-4 animate-fadeIn">
                                <label className="block text-parchment text-sm mb-1">Price ($)</label>
                                <input
                                    type="number"
                                    name="ticketPrice"
                                    value={eventData.ticketPrice}
                                    onChange={handleChange}
                                    className="w-full bg-charcoal border border-bronze/30 rounded p-3 text-parchment focus:border-bronze focus:outline-none"
                                    min="0"
                                />
                             </div>
                         )}

                        <div className="mb-4">
                             <label className="block text-parchment text-sm mb-1">Capacity</label>
                             <input
                                type="number"
                                name="capacity"
                                value={eventData.capacity}
                                onChange={handleChange}
                                className="w-full bg-charcoal border border-bronze/30 rounded p-3 text-parchment focus:border-bronze focus:outline-none placeholder-gray-600"
                                placeholder="Leave empty for unlimited"
                                min="1"
                             />
                         </div>

                         <div className="flex items-center justify-between pt-2 border-t border-bronze/10">
                             <span className="text-parchment text-sm">Require Approval</span>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="requireApproval"
                                    checked={eventData.requireApproval}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-charcoal peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-bronze rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-parchment after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bronze"></div>
                            </label>
                         </div>
                    </div>
                </div>
            </form>

            <div className="mt-10 flex justify-end gap-4">
                <button
                    type="button"
                    className="px-6 py-3 rounded border border-bronze/30 text-bronze hover:bg-bronze/10 transition-colors"
                    onClick={() => console.log('Cancelled')}
                >
                    Discard
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-8 py-3 rounded bg-gradient-to-r from-bronze to-[#8c6b4a] text-charcoal font-bold shadow-lg shadow-bronze/20 hover:shadow-bronze/40 transform hover:-translate-y-0.5 transition-all"
                >
                    Create Event
                </button>
            </div>
        </div>
    </div>
  );
};

export default CreateEvent;

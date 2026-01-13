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
        const payload = {
            ...eventData,
            capacity: eventData.capacity === '' ? null : Number(eventData.capacity),
            ticketPrice: Number(eventData.ticketPrice)
        };

      const res = await axios.post('/api/admin/events', payload);
      setMessage('Event created successfully!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-sky-mint-bg p-8 font-serif text-sky-mint-text">
        <div className="max-w-5xl mx-auto">
            <header className="mb-10 text-center relative">
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-mint-accent to-transparent opacity-50"></div>
                <h1 className="text-4xl text-sky-mint-accent mb-2 tracking-wide font-bold">Create New Event</h1>
                <p className="text-sky-mint-muted italic">Curate an unforgettable experience</p>
            </header>

            {message && <div className="mb-6 p-4 bg-sky-mint-card border border-green-500 text-green-600 rounded shadow-md">{message}</div>}
            {error && <div className="mb-6 p-4 bg-red-50 border border-red-500 text-red-600 rounded shadow-md">{error}</div>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Event Details Card */}
                    <div className="bg-sky-mint-card p-6 rounded-lg border border-sky-mint-border shadow-lg shadow-sky-mint-accent/10">
                        <h2 className="text-xl text-sky-mint-secondary mb-4 border-b border-sky-mint-border pb-2 font-semibold">Event Details</h2>

                        <div className="mb-4">
                            <label className="block text-sky-mint-text text-sm mb-1 font-medium">Event Name</label>
                            <input
                                type="text"
                                name="eventName"
                                value={eventData.eventName}
                                onChange={handleChange}
                                className="w-full bg-sky-mint-bg border border-sky-mint-border rounded p-3 text-sky-mint-text focus:border-sky-mint-accent focus:outline-none focus:ring-1 focus:ring-sky-mint-accent transition-colors placeholder-sky-mint-muted"
                                placeholder="e.g. Annual Gala 2026"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sky-mint-text text-sm mb-1 font-medium">Description</label>
                            <textarea
                                name="description"
                                value={eventData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full bg-sky-mint-bg border border-sky-mint-border rounded p-3 text-sky-mint-text focus:border-sky-mint-accent focus:outline-none transition-colors placeholder-sky-mint-muted"
                                placeholder="Describe the essence of your event..."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sky-mint-text text-sm mb-1 font-medium">Calendar Type</label>
                                <select
                                    name="calendarType"
                                    value={eventData.calendarType}
                                    onChange={handleChange}
                                    className="w-full bg-sky-mint-bg border border-sky-mint-border rounded p-3 text-sky-mint-text focus:border-sky-mint-accent focus:outline-none appearance-none"
                                >
                                    <option value="personal">Personal Calendar</option>
                                    <option value="team">Team Calendar</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sky-mint-text text-sm mb-1 font-medium">Visibility</label>
                                <select
                                    name="visibility"
                                    value={eventData.visibility}
                                    onChange={handleChange}
                                    className="w-full bg-sky-mint-bg border border-sky-mint-border rounded p-3 text-sky-mint-text focus:border-sky-mint-accent focus:outline-none appearance-none"
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Date & Location Card */}
                    <div className="bg-sky-mint-card p-6 rounded-lg border border-sky-mint-border shadow-lg shadow-sky-mint-accent/10">
                         <h2 className="text-xl text-sky-mint-secondary mb-4 border-b border-sky-mint-border pb-2 font-semibold">Date & Location</h2>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                             <div>
                                <label className="block text-sky-mint-text text-sm mb-1 font-medium">Start Date & Time</label>
                                <input
                                    type="datetime-local"
                                    name="startDateTime"
                                    value={eventData.startDateTime}
                                    onChange={handleChange}
                                    className="w-full bg-sky-mint-bg border border-sky-mint-border rounded p-3 text-sky-mint-text focus:border-sky-mint-accent focus:outline-none"
                                    required
                                />
                             </div>
                             <div>
                                <label className="block text-sky-mint-text text-sm mb-1 font-medium">End Date & Time</label>
                                <input
                                    type="datetime-local"
                                    name="endDateTime"
                                    value={eventData.endDateTime}
                                    onChange={handleChange}
                                    className="w-full bg-sky-mint-bg border border-sky-mint-border rounded p-3 text-sky-mint-text focus:border-sky-mint-accent focus:outline-none"
                                    required
                                />
                             </div>
                         </div>

                        <div className="mb-4">
                             <label className="block text-sky-mint-text text-sm mb-1 font-medium">Timezone</label>
                             <select
                                name="timeZone"
                                value={eventData.timeZone}
                                onChange={handleChange}
                                className="w-full bg-sky-mint-bg border border-sky-mint-border rounded p-3 text-sky-mint-text focus:border-sky-mint-accent focus:outline-none"
                             >
                                 <option value="GMT+05:30">GMT+05:30 (India Standard Time)</option>
                                 <option value="UTC">UTC</option>
                                 <option value="EST">EST</option>
                                 <option value="PST">PST</option>
                             </select>
                        </div>

                         <div className="mb-4">
                            <label className="block text-sky-mint-text text-sm mb-1 font-medium">Location Type</label>
                             <div className="flex gap-4 mb-2">
                                 <label className="flex items-center cursor-pointer">
                                     <input
                                        type="radio"
                                        name="locationType"
                                        value="offline"
                                        checked={eventData.locationType === 'offline'}
                                        onChange={handleChange}
                                        className="text-sky-mint-accent focus:ring-sky-mint-accent bg-sky-mint-bg border-sky-mint-border"
                                     />
                                     <span className="ml-2 text-sky-mint-text">Offline</span>
                                 </label>
                                 <label className="flex items-center cursor-pointer">
                                     <input
                                        type="radio"
                                        name="locationType"
                                        value="online"
                                        checked={eventData.locationType === 'online'}
                                        onChange={handleChange}
                                        className="text-sky-mint-accent focus:ring-sky-mint-accent bg-sky-mint-bg border-sky-mint-border"
                                     />
                                     <span className="ml-2 text-sky-mint-text">Online</span>
                                 </label>
                             </div>
                             <input
                                type="text"
                                name="locationValue"
                                value={eventData.locationValue}
                                onChange={handleChange}
                                className="w-full bg-sky-mint-bg border border-sky-mint-border rounded p-3 text-sky-mint-text focus:border-sky-mint-accent focus:outline-none placeholder-sky-mint-muted"
                                placeholder={eventData.locationType === 'offline' ? "Enter address/venue" : "Enter meeting link"}
                                required
                            />
                         </div>
                    </div>
                </div>

                {/* Right Column - Settings & Media */}
                <div className="space-y-6">
                    {/* Media Card */}
                     <div className="bg-sky-mint-card p-6 rounded-lg border border-sky-mint-border shadow-lg shadow-sky-mint-accent/10">
                        <h2 className="text-xl text-sky-mint-secondary mb-4 border-b border-sky-mint-border pb-2 font-semibold">Cover Image</h2>
                        <div className="mb-4">
                            <label className="block text-sky-mint-text text-sm mb-1 font-medium">Image URL</label>
                            <input
                                type="text"
                                name="coverImage"
                                value={eventData.coverImage}
                                onChange={handleChange}
                                className="w-full bg-sky-mint-bg border border-sky-mint-border rounded p-3 text-sky-mint-text focus:border-sky-mint-accent focus:outline-none text-sm placeholder-sky-mint-muted"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="h-40 bg-sky-mint-bg rounded border border-sky-mint-border flex items-center justify-center overflow-hidden relative group">
                            {eventData.coverImage ? (
                                <img src={eventData.coverImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                            ) : (
                                <span className="text-sky-mint-muted text-sm italic">Image Preview</span>
                            )}
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <span className="text-white text-sm">Preview only</span>
                            </div>
                        </div>
                    </div>

                    {/* Settings Card */}
                    <div className="bg-sky-mint-card p-6 rounded-lg border border-sky-mint-border shadow-lg shadow-sky-mint-accent/10">
                         <h2 className="text-xl text-sky-mint-secondary mb-4 border-b border-sky-mint-border pb-2 font-semibold">Configurations</h2>

                         <div className="mb-4">
                            <label className="block text-sky-mint-text text-sm mb-1 font-medium">Theme</label>
                            <select
                                name="theme"
                                value={eventData.theme}
                                onChange={handleChange}
                                className="w-full bg-sky-mint-bg border border-sky-mint-border rounded p-3 text-sky-mint-text focus:border-sky-mint-accent focus:outline-none"
                             >
                                 <option value="minimal">Minimal</option>
                                 <option value="holiday">Holiday</option>
                                 <option value="abstract">Abstract</option>
                             </select>
                         </div>

                         <div className="mb-4">
                             <label className="block text-sky-mint-text text-sm mb-2 font-medium">Ticket Type</label>
                             <div className="flex gap-2">
                                 <button
                                     type="button"
                                     onClick={() => handleTicketTypeChange('free')}
                                     className={`flex-1 py-2 px-4 rounded border font-medium ${eventData.ticketType === 'free' ? 'bg-sky-mint-accent text-white border-sky-mint-accent' : 'bg-transparent text-sky-mint-text border-sky-mint-border hover:border-sky-mint-accent'}`}
                                 >
                                     Free
                                 </button>
                                 <button
                                     type="button"
                                     onClick={() => handleTicketTypeChange('paid')}
                                     className={`flex-1 py-2 px-4 rounded border font-medium ${eventData.ticketType === 'paid' ? 'bg-sky-mint-accent text-white border-sky-mint-accent' : 'bg-transparent text-sky-mint-text border-sky-mint-border hover:border-sky-mint-accent'}`}
                                 >
                                     Paid
                                 </button>
                             </div>
                         </div>

                         {eventData.ticketType === 'paid' && (
                             <div className="mb-4 animate-fadeIn">
                                <label className="block text-sky-mint-text text-sm mb-1 font-medium">Price ($)</label>
                                <input
                                    type="number"
                                    name="ticketPrice"
                                    value={eventData.ticketPrice}
                                    onChange={handleChange}
                                    className="w-full bg-sky-mint-bg border border-sky-mint-border rounded p-3 text-sky-mint-text focus:border-sky-mint-accent focus:outline-none"
                                    min="0"
                                />
                             </div>
                         )}

                        <div className="mb-4">
                             <label className="block text-sky-mint-text text-sm mb-1 font-medium">Capacity</label>
                             <input
                                type="number"
                                name="capacity"
                                value={eventData.capacity}
                                onChange={handleChange}
                                className="w-full bg-sky-mint-bg border border-sky-mint-border rounded p-3 text-sky-mint-text focus:border-sky-mint-accent focus:outline-none placeholder-sky-mint-muted"
                                placeholder="Leave empty for unlimited"
                                min="1"
                             />
                         </div>

                         <div className="flex items-center justify-between pt-2 border-t border-sky-mint-border">
                             <span className="text-sky-mint-text text-sm font-medium">Require Approval</span>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="requireApproval"
                                    checked={eventData.requireApproval}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-sky-mint-bg peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-sky-mint-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-mint-secondary shadow-inner border border-sky-mint-border"></div>
                            </label>
                         </div>
                    </div>
                </div>
            </form>

            <div className="mt-10 flex justify-end gap-4">
                <button
                    type="button"
                    className="px-6 py-3 rounded border border-sky-mint-border text-sky-mint-muted hover:bg-sky-mint-accent/10 hover:text-sky-mint-accent transition-colors font-medium"
                    onClick={() => console.log('Cancelled')}
                >
                    Discard
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-8 py-3 rounded bg-gradient-to-r from-sky-mint-gradient-start to-sky-mint-gradient-end text-white font-bold shadow-lg shadow-sky-mint-accent/30 hover:shadow-sky-mint-accent/50 transform hover:-translate-y-0.5 transition-all"
                >
                    Create Event
                </button>
            </div>
        </div>
    </div>
  );
};

export default CreateEvent;

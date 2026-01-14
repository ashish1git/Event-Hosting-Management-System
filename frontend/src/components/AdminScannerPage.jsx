import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRScanner from './QRScanner';
import API from '../services/api';

const AdminScannerPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventDetails();
    fetchStats();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const { data } = await API.get(`/api/admin/events/${eventId}`);
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await API.get(`/api/attendance/event/${eventId}`);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleScanSuccess = () => {
    // Refresh stats after successful scan
    fetchStats();
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#1E1E1E] rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-cyan-400" />
                <div>
                  <p className="text-gray-400 text-sm">Total Registered</p>
                  <p className="text-2xl font-bold text-white">{stats.totalRegistrations}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#1E1E1E] rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-gray-400 text-sm">Checked In</p>
                  <p className="text-2xl font-bold text-white">{stats.totalAttendance}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#1E1E1E] rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-pink-400" />
                <div>
                  <p className="text-gray-400 text-sm">Attendance Rate</p>
                  <p className="text-2xl font-bold text-white">{stats.attendanceRate}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scanner */}
        <QRScanner
          eventId={eventId}
          eventName={event.eventName}
          onScanSuccess={handleScanSuccess}
        />
      </div>
    </div>
  );
};

export default AdminScannerPage;

import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Star, MessageSquare, Calendar, Mail } from 'lucide-react';
import API from '../services/api';

const AttendanceWithFeedback = ({ eventId, eventName }) => {
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' or 'feedback'

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch attendance
      const attendanceRes = await API.get(`/api/attendance/event/${eventId}`);
      setAttendanceData(attendanceRes.data);

      // Fetch feedback
      const feedbackRes = await API.get(`/api/attendance/feedback/event/${eventId}`);
      setFeedbackData(feedbackRes.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1E1E1E] rounded-2xl p-8 border border-white/10 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-400 mt-4">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1E1E1E] rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Attendance</p>
              <p className="text-white text-2xl font-bold">{attendanceData?.totalAttendance || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1E1E1E] rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Attendance Rate</p>
              <p className="text-white text-2xl font-bold">{attendanceData?.attendanceRate || 0}%</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1E1E1E] rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg Rating</p>
              <p className="text-white text-2xl font-bold">{feedbackData?.averageRating || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1E1E1E] rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Feedback Count</p>
              <p className="text-white text-2xl font-bold">{feedbackData?.totalFeedback || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === 'attendance'
              ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white'
              : 'bg-[#1E1E1E] text-gray-400 border border-white/10'
          }`}
        >
          <Users className="w-5 h-5 inline mr-2" />
          Attendance List
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === 'feedback'
              ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white'
              : 'bg-[#1E1E1E] text-gray-400 border border-white/10'
          }`}
        >
          <Star className="w-5 h-5 inline mr-2" />
          Feedback
        </button>
      </div>

      {/* Content */}
      {activeTab === 'attendance' && (
        <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Attendance Records</h3>

          {attendanceData?.attendance?.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No attendance records yet</p>
          ) : (
            <div className="space-y-3">
              {attendanceData?.attendance?.map((record, index) => (
                <div key={index} className="bg-[#2a2a2a] rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white font-semibold">{record.user?.fullName}</p>
                    <p className="text-gray-400 text-sm">{record.user?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(record.scanTime).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(record.scanTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-6">
          {/* Rating Distribution */}
          {feedbackData?.ratingDistribution && (
            <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Rating Distribution</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-20">
                      <span className="text-white font-semibold">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 bg-[#2a2a2a] rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-pink-500 h-full rounded-full transition-all"
                        style={{
                          width: `${feedbackData.totalFeedback > 0
                            ? (feedbackData.ratingDistribution[rating] / feedbackData.totalFeedback) * 100
                            : 0}%`
                        }}
                      />
                    </div>
                    <span className="text-gray-400 w-12 text-right">
                      {feedbackData.ratingDistribution[rating]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Comments */}
          <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Feedback Comments</h3>

            {feedbackData?.feedback?.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No feedback submitted yet</p>
            ) : (
              <div className="space-y-4">
                {feedbackData?.feedback?.map((fb, index) => (
                  <div key={index} className="bg-[#2a2a2a] rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-semibold">{fb.user?.fullName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(fb.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    {fb.comment && (
                      <p className="text-gray-300 text-sm mt-2 italic">"{fb.comment}"</p>
                    )}
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(fb.submittedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceWithFeedback;

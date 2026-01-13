import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CreateEvent from './components/CreateEvent';

// Simple Dashboard for demonstration
const AdminDashboard = () => (
  <div className="min-h-screen bg-[#121212] flex items-center justify-center text-center p-20">
    <div>
      <h1 className="text-5xl font-black text-white mb-6">Admin Dashboard</h1>
      <p className="text-gray-400 mb-10 max-w-md mx-auto">Welcome to the inner sanctum. Manage your events and track performance metrics from here.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-pointer">
          <h3 className="text-2xl font-bold text-cyan-400 mb-2">12 Active Events</h3>
          <p className="text-sm text-gray-500 italic">Tracking in real-time</p>
        </div>
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-pointer">
          <h3 className="text-2xl font-bold text-pink-500 mb-2">1,024 RSVPs</h3>
          <p className="text-sm text-gray-500 italic">Growing visibility</p>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App selection:bg-cyan-500/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/create" element={<CreateEvent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

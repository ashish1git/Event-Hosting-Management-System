import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CreateEvent from './components/CreateEvent';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App selection:bg-cyan-500/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/create" element={<CreateEvent />} />
          <Route path="/admin/edit/:id" element={<CreateEvent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

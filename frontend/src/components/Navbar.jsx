import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Calendar, Layout, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-[100] px-6 py-6"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">EventSync</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors font-medium">Home</Link>
          <a href="#" className="text-gray-400 hover:text-white transition-colors font-medium">Explore</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors font-medium">Pricing</a>
          <Link to="/admin" className="text-gray-400 hover:text-white transition-colors font-medium">Admin Portal</Link>
        </div>

        {/* Action */}
        <div className="flex items-center space-x-4">
           <Link
            to="/login"
            className="text-gray-400 hover:text-white font-medium text-sm transition-colors hidden sm:block"
          >
            Log In
          </Link>
          <Link
             to="/signup"
             className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all text-sm hidden sm:block"
          >
             Sign Up
          </Link>
          <Link
            to="/admin/create"
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all transform hover:-translate-y-0.5 active:scale-95 text-sm"
          >
            Create Event
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

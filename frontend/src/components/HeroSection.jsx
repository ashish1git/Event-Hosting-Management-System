import React from 'react';
import { motion } from 'framer-motion';
import { Play, Speaker, Box, Smartphone, ExternalLink } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-[#121212] flex items-center justify-center overflow-hidden font-sans">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-[10%] w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col space-y-8"
        >
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">Luma</span>
          </div>

          {/* Heading */}
          <h1 className="text-6xl md:text-8xl font-black leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Elevate Your <br /> Events.
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">
            Experience the future of event management with high-fidelity visuals,
            seamless coordination, and immersive digital portals. Designed for the bold.
          </p>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255, 0, 204, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-blue-600 text-white font-bold rounded-2xl relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm" />
              <span className="relative z-10 flex items-center space-x-2">
                <span>Gather Now</span>
                <ExternalLink size={20} />
              </span>
            </motion.button>
            <button className="text-gray-300 font-medium hover:text-white transition-colors border-b border-gray-600 pb-1">
              View Showcase
            </button>
          </div>
        </motion.div>

        {/* Right Content - Portal */}
        <div className="relative flex items-center justify-center h-[500px] lg:h-[700px]">

          {/* Circular Portal Background */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full border border-white/10 bg-gradient-to-tr from-purple-900/40 to-cyan-900/40 backdrop-blur-3xl shadow-2xl overflow-hidden"
          >
            {/* Video Player */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative w-full aspect-video bg-black/60 rounded-xl border border-white/20 overflow-hidden shadow-2xl">
                <video
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/phone-dark.mp4" type="video/mp4" />
                </video>

                {/* Video UI Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 cursor-pointer hover:bg-white/40">
                      <Play size={14} className="text-white fill-white" />
                    </div>
                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "65%" }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        className="h-full bg-cyan-400 shadow-[0_0_10px_#00FFFF]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating 3D Elements */}

          {/* Floating Speaker 1 */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-0 z-20"
          >
            <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
              <Speaker className="text-pink-500 w-12 h-12" />
              <div className="absolute -inset-0.5 bg-gradient-to-br from-pink-500/50 to-purple-500/50 blur opacity-30 -z-10" />
            </div>
          </motion.div>

          {/* Floating Cube */}
          <motion.div
            animate={{
              y: [0, 30, 0],
              rotate: [0, -10, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-[20%] left-[5%] z-20"
          >
            <div className="p-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
              <Box className="text-cyan-400 w-10 h-10" />
            </div>
          </motion.div>

          {/* Floating Smartphone */}
          <motion.div
            animate={{
              y: [-10, 10, -10],
              rotate: [5, -5, 5]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] right-[-5%] z-20"
          >
            <div className="p-4 bg-black/40 backdrop-blur-2xl border border-white/20 rounded-[2rem] shadow-2xl relative">
              <Smartphone className="text-purple-400 w-16 h-16" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/20 rounded-full" />
            </div>
          </motion.div>

          {/* Additional Floating Shape */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-[60%] right-[10%] w-12 h-12 bg-pink-500/20 blur-xl rounded-full"
          />

        </div>
      </div>

      {/* Decorative Particle Elements */}
      <div className="absolute bottom-10 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#00FFFF]" />
      <div className="absolute top-20 right-40 w-3 h-3 bg-pink-500 rounded-full animate-pulse shadow-[0_0_10px_#FF00CC]" />
    </div>
  );
};

export default HeroSection;

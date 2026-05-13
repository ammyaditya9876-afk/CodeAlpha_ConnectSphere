import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, MessageSquare, Presentation, ShieldCheck } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">ConnectSphere</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="text-sm font-medium px-4 py-2 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Meetings that feel <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              effortlessly real.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Experience crystal-clear video, seamless screen sharing, and collaborative whiteboards in one unified workspace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105">
              Start for free
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-full bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition-all">
              Join a meeting
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left"
        >
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
            <Video className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">HD Video & Audio</h3>
            <p className="text-zinc-400 text-sm">WebRTC powered ultra-low latency streaming for uninterrupted conversations.</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
            <Presentation className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interactive Whiteboard</h3>
            <p className="text-zinc-400 text-sm">Draw, brainstorm, and collaborate in real-time with integrated canvas tools.</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-zinc-400 text-sm">End-to-end encrypted signaling and robust JWT authentication.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Video, Keyboard, LogOut, User as UserIcon } from 'lucide-react';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');

  const createMeeting = () => {
    const id = Math.random().toString(36).substring(2, 10);
    navigate(`/meeting/${id}?host=true`);
  };

  const joinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      navigate(`/meeting/${roomCode}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6 md:p-12">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-16">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">ConnectSphere</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/profile" className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 hover:bg-zinc-800 transition-colors">
            <UserIcon className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium">{user?.name}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Video calls and meetings for everyone.
          </h1>
          <p className="text-zinc-400 text-lg mb-10">
            Connect, collaborate, and celebrate from anywhere with ConnectSphere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <button
              onClick={createMeeting}
              className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors w-full sm:w-auto justify-center"
            >
              <Video className="w-5 h-5" />
              New Meeting
            </button>
            
            <form onSubmit={joinMeeting} className="flex items-center gap-2 w-full sm:w-auto relative">
              <div className="relative w-full">
                <Keyboard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder="Enter a code or link"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={!roomCode.trim()}
                className="px-6 py-3.5 font-medium text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center relative">
          <div className="absolute w-full h-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-[100px]" />
          <div className="relative w-full aspect-video bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center">
            {/* Placeholder for illustration */}
            <div className="text-zinc-600 flex flex-col items-center gap-4">
              <Video className="w-16 h-16" />
              <span className="text-lg font-medium">Your meetings are safe</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { User, Mail, Shield, ArrowLeft } from 'lucide-react';

export default function Profile() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-2xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-zinc-800">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-zinc-400">Member since {new Date().getFullYear()}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Display Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
              </div>
              <button className="text-indigo-400 text-sm font-medium hover:text-indigo-300">Edit</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Email Address</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <button className="text-indigo-400 text-sm font-medium hover:text-indigo-300">Edit</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Password</p>
                  <p className="font-medium">••••••••</p>
                </div>
              </div>
              <button className="text-indigo-400 text-sm font-medium hover:text-indigo-300">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

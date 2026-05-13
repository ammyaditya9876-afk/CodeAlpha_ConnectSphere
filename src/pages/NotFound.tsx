import { Link } from 'react-router-dom';
import { Ghost } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
      <Ghost className="w-24 h-24 text-indigo-500 mb-6 animate-bounce" />
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl text-zinc-400 mb-8">Oops! The page you're looking for has vanished.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-white text-zinc-950 font-medium rounded-full hover:bg-zinc-200 transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
}

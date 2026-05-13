import { useEffect, useRef } from 'react';
import { MicOff, VideoOff } from 'lucide-react';

interface VideoGridProps {
  myStream: MediaStream | null;
  peers: any[];
  isAudioMuted: boolean;
  isVideoOff: boolean;
  userName: string;
}

const Video = ({ peer, name }: { peer: any, name: string }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    peer.on('stream', (stream: MediaStream) => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    });
  }, [peer]);

  return (
    <div className="relative w-full h-full bg-zinc-800 rounded-2xl overflow-hidden shadow-lg border border-zinc-700">
      <video ref={ref} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-md text-sm font-medium">
        {name || 'Participant'}
      </div>
    </div>
  );
};

export default function VideoGrid({ myStream, peers, isAudioMuted, isVideoOff, userName }: VideoGridProps) {
  const myVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  const totalVideos = peers.length + 1;
  const gridClass = totalVideos === 1 
    ? 'grid-cols-1' 
    : totalVideos === 2 
      ? 'grid-cols-1 md:grid-cols-2' 
      : totalVideos <= 4 
        ? 'grid-cols-2' 
        : 'grid-cols-2 md:grid-cols-3';

  return (
    <div className={`w-full h-full grid ${gridClass} gap-4 p-4`}>
      {/* My Video */}
      <div className="relative w-full h-full bg-zinc-800 rounded-2xl overflow-hidden shadow-lg border border-zinc-700 group">
        <video 
          ref={myVideoRef} 
          autoPlay 
          muted 
          playsInline 
          className={`w-full h-full object-cover transition-all ${isVideoOff ? 'opacity-0' : 'opacity-100'}`} 
        />
        {isVideoOff && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-800">
            <div className="w-20 h-20 bg-zinc-700 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl font-bold">{userName.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-md text-sm font-medium flex items-center gap-2">
          {userName} (You)
          {isAudioMuted && <MicOff className="w-4 h-4 text-red-400" />}
          {isVideoOff && <VideoOff className="w-4 h-4 text-red-400" />}
        </div>
      </div>

      {/* Peer Videos */}
      {peers.map((peer, index) => (
        <Video key={index} peer={peer} name={`Participant ${index + 1}`} />
      ))}
    </div>
  );
}

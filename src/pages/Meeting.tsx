import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import Peer from 'simple-peer';
import { Mic, MicOff, Video as VideoIcon, VideoOff, MonitorUp, PenTool, MessageSquare, PhoneOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useMeetingStore } from '../store/useMeetingStore';
import VideoGrid from '../components/VideoGrid';
import Chat from '../components/Chat';
import Whiteboard from '../components/Whiteboard';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export default function Meeting() {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const { 
    isAudioMuted, 
    isVideoOff, 
    isScreenSharing,
    toggleAudio, 
    toggleVideo, 
    toggleScreenShare 
  } = useMeetingStore();

  const [activeTab, setActiveTab] = useState<'video' | 'whiteboard'>('video');
  const [showChat, setShowChat] = useState(false);
  const [peers, setPeers] = useState<any[]>([]);
  
  const socketRef = useRef<Socket | null>(null);
  const myStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    socketRef.current = io(SOCKET_URL);
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      myStreamRef.current = stream;
      
      socketRef.current?.emit('join-room', roomId, user._id);

      socketRef.current?.on('user-connected', (userId: string, socketId: string) => {
        if (!socketRef.current?.id) return;
        const peer = createPeer(socketId, socketRef.current.id, stream);
        peersRef.current.push({
          peerID: socketId,
          peer,
        });
        setPeers((users) => [...users, peer]);
      });

      socketRef.current?.on('offer', (payload) => {
        const peer = addPeer(payload.signal, payload.callerID, stream);
        peersRef.current.push({
          peerID: payload.callerID,
          peer,
        });
        setPeers((users) => [...users, peer]);
      });

      socketRef.current?.on('answer', (payload) => {
        const item = peersRef.current.find((p) => p.peerID === payload.id);
        item?.peer.signal(payload.signal);
      });

      socketRef.current?.on('ice-candidate', (payload) => {
        const item = peersRef.current.find((p) => p.peerID === payload.id);
        item?.peer.signal(payload.candidate);
      });

      socketRef.current?.on('user-disconnected', (userId: string, socketId: string) => {
        const peerObj = peersRef.current.find((p) => p.peerID === socketId);
        if (peerObj) {
          peerObj.peer.destroy();
        }
        const newPeers = peersRef.current.filter((p) => p.peerID !== socketId);
        peersRef.current = newPeers;
        setPeers(newPeers.map((p) => p.peer));
      });
    });

    return () => {
      myStreamRef.current?.getTracks().forEach((track) => track.stop());
      socketRef.current?.disconnect();
    };
  }, [roomId, user, navigate]);

  function createPeer(userToSignal: string, callerID: string, stream: MediaStream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socketRef.current?.emit('offer', {
        target: userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal: any, callerID: string, stream: MediaStream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socketRef.current?.emit('answer', { signal, target: callerID, id: socketRef.current?.id });
    });

    peer.signal(incomingSignal);
    return peer;
  }

  const handleToggleAudio = () => {
    if (myStreamRef.current) {
      myStreamRef.current.getAudioTracks()[0].enabled = isAudioMuted;
      toggleAudio();
      socketRef.current?.emit('toggle-audio', roomId, user?._id, !isAudioMuted);
    }
  };

  const handleToggleVideo = () => {
    if (myStreamRef.current) {
      myStreamRef.current.getVideoTracks()[0].enabled = isVideoOff;
      toggleVideo();
      socketRef.current?.emit('toggle-video', roomId, user?._id, !isVideoOff);
    }
  };

  const handleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true } as any);
        const videoTrack = screenStream.getVideoTracks()[0];
        
        peersRef.current.forEach((peerObj) => {
          const sender = peerObj.peer._pc.getSenders().find((s: any) => s.track.kind === 'video');
          if (sender) sender.replaceTrack(videoTrack);
        });

        videoTrack.onended = () => {
          stopScreenShare();
        };

        toggleScreenShare();
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (myStreamRef.current) {
      const videoTrack = myStreamRef.current.getVideoTracks()[0];
      peersRef.current.forEach((peerObj) => {
        const sender = peerObj.peer._pc.getSenders().find((s: any) => s.track.kind === 'video');
        if (sender) sender.replaceTrack(videoTrack);
      });
      toggleScreenShare();
    }
  };

  const handleLeave = () => {
    navigate('/dashboard');
  };

  return (
    <div className="h-screen w-full bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-14 bg-zinc-950 flex items-center justify-between px-6 border-b border-zinc-900 shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-lg">Meeting Room: {roomId}</span>
          <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">
            {peers.length + 1} Participants
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('video')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'video' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
          >
            Video
          </button>
          <button 
            onClick={() => setActiveTab('whiteboard')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'whiteboard' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
          >
            Whiteboard
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 p-4 flex flex-col items-center justify-center relative transition-all duration-300">
          {activeTab === 'video' ? (
            <VideoGrid 
              myStream={myStreamRef.current} 
              peers={peers} 
              isAudioMuted={isAudioMuted} 
              isVideoOff={isVideoOff} 
              userName={user?.name || 'Guest'} 
            />
          ) : (
            <Whiteboard socket={socketRef.current} roomId={roomId!} />
          )}
        </div>

        {/* Chat Sidebar */}
        <div className={`w-80 bg-zinc-950 transition-all duration-300 ${showChat ? 'translate-x-0' : 'translate-x-full absolute right-0 top-0 bottom-0'}`}>
          {socketRef.current && <Chat socket={socketRef.current} roomId={roomId!} />}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-20 bg-zinc-950 flex items-center justify-between px-6 border-t border-zinc-900 shrink-0">
        <div className="w-1/3" />
        <div className="flex items-center gap-4 justify-center flex-1">
          <button 
            onClick={handleToggleAudio}
            className={`p-4 rounded-full transition-colors ${isAudioMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
          >
            {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={handleToggleVideo}
            className={`p-4 rounded-full transition-colors ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
          </button>

          <button 
            onClick={handleScreenShare}
            className={`p-4 rounded-full transition-colors ${isScreenSharing ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
          >
            <MonitorUp className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setActiveTab(activeTab === 'video' ? 'whiteboard' : 'video')}
            className={`p-4 rounded-full transition-colors ${activeTab === 'whiteboard' ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
          >
            <PenTool className="w-5 h-5" />
          </button>

          <button 
            onClick={handleLeave}
            className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors ml-4"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>

        <div className="w-1/3 flex justify-end">
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`p-4 rounded-full transition-colors ${showChat ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

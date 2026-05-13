import { Server, Socket } from 'socket.io';

export const setupSocket = (io: Server) => {
  const users: Record<string, string> = {}; // socketId -> roomId

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-room', (roomId: string, userId: string) => {
      socket.join(roomId);
      users[socket.id] = roomId;
      socket.to(roomId).emit('user-connected', userId, socket.id);

      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId, socket.id);
      });
    });

    socket.on('send-message', (roomId: string, message: any) => {
      io.to(roomId).emit('receive-message', message);
    });

    socket.on('draw-data', (roomId: string, data: any) => {
      socket.to(roomId).emit('draw-data', data);
    });
    
    socket.on('clear-canvas', (roomId: string) => {
      socket.to(roomId).emit('clear-canvas');
    });
    
    socket.on('toggle-audio', (roomId: string, userId: string, isMuted: boolean) => {
      socket.to(roomId).emit('user-toggled-audio', userId, isMuted);
    });

    socket.on('toggle-video', (roomId: string, userId: string, isVideoOff: boolean) => {
      socket.to(roomId).emit('user-toggled-video', userId, isVideoOff);
    });

    // WebRTC Signaling
    socket.on('offer', (payload) => {
      io.to(payload.target).emit('offer', payload);
    });

    socket.on('answer', (payload) => {
      io.to(payload.target).emit('answer', payload);
    });

    socket.on('ice-candidate', (payload) => {
      io.to(payload.target).emit('ice-candidate', payload);
    });
  });
};

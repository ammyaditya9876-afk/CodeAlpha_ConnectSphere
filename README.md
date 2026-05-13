# ConnectSphere

A complete production-style full-stack Real-Time Communication Web Application.

## Features
- **User Authentication**: JWT-based login and registration.
- **Real-Time Video Calling**: WebRTC and Socket.io for multi-user conferencing.
- **Screen Sharing**: Easily share your screen with participants.
- **Collaborative Whiteboard**: Real-time synced drawing board.
- **Real-Time Chat**: Integrated meeting chat.
- **Modern UI**: Built with React, Tailwind CSS, and Framer Motion.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Zustand, Framer Motion, Simple-Peer.
- **Backend**: Node.js, Express, Socket.io, MongoDB, Mongoose, JWT.

## Setup Instructions

1. **Clone the repository** (or use the provided files).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/connectsphere
   JWT_SECRET=your_super_secret_jwt_key
   CLIENT_URL=http://localhost:5173
   ```
4. **Start the development servers**:
   ```bash
   npm run dev
   ```
   *This will run both the frontend and backend concurrently.*

## Deployment

### Frontend (Vercel)
1. Push the code to a GitHub repository.
2. Import the repository into Vercel.
3. Set the Framework Preset to `Vite`.
4. Add the `VITE_SOCKET_URL` environment variable pointing to your deployed backend URL.
5. Deploy.

### Backend (Render)
1. Push the code to a GitHub repository.
2. Create a new "Web Service" on Render.
3. Connect your repository.
4. Build Command: `npm install && npm run build` (Note: Ensure your `tsconfig` and build scripts are properly set up for production).
5. Start Command: `node dist/api/server.js` or use `tsx api/server.ts` if running directly.
6. Add your Environment Variables (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`).
7. Deploy.

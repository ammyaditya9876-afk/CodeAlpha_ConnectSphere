## 1. Architecture Design
```mermaid
graph TD
    subgraph Frontend["Frontend (React + Vite)"]
        UI["UI Components (Tailwind)"]
        State["State Management (Redux/Context)"]
        WebRTC_Client["WebRTC Peer Connections"]
        Socket_Client["Socket.io Client"]
    end
    
    subgraph Backend["Backend (Node.js + Express)"]
        API["REST API (Auth, User)"]
        Socket_Server["Socket.io Server (Signaling, Chat, Whiteboard)"]
        Auth_MW["Auth Middleware (JWT)"]
    end
    
    subgraph Database["Data Layer"]
        MongoDB["MongoDB (Mongoose)"]
    end
    
    subgraph External["External Services"]
        Cloudinary["Cloudinary (File Storage)"]
    end

    UI <--> State
    State <--> API
    API <--> Auth_MW
    Auth_MW <--> MongoDB
    WebRTC_Client <--> Socket_Server
    Socket_Client <--> Socket_Server
    API <--> Cloudinary
    WebRTC_Client <--> WebRTC_Client
```

## 2. Technology Description
- Frontend: React@18 + tailwindcss@3 + vite, Redux Toolkit, Framer Motion, Socket.io-client, Simple-peer (or native WebRTC).
- Backend: Node.js, Express.js, Socket.io, Mongoose, bcryptjs, jsonwebtoken, dotenv.
- Initialization Tool: vite (create-vite), npm init.
- Deployment: Vercel (Frontend), Render (Backend).

## 3. Route Definitions
| Route | Purpose |
|-------|---------|
| / | Landing Page |
| /login | User login |
| /register | User registration |
| /dashboard | User dashboard (protected) |
| /meeting/:id | Meeting room interface (protected/guest with name) |
| /profile | User profile settings (protected) |
| * | 404 Not Found Page |

## 4. API Definitions
```typescript
// POST /api/auth/register
interface RegisterRequest {
  name: string;
  email: string;
  passwordHash: string;
}
interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

// POST /api/auth/login
interface LoginRequest {
  email: string;
  passwordHash: string;
}

// GET /api/users/profile
// Headers: Authorization: Bearer <token>
```

## 5. Server Architecture Diagram
```mermaid
graph TD
    Router["Express Routes"] --> AuthController["Auth Controller"]
    Router --> MeetingController["Meeting Controller"]
    AuthController --> UserRepo["User Model (Mongoose)"]
    MeetingController --> MeetingRepo["Meeting Model (Mongoose)"]
    UserRepo --> DB["MongoDB"]
    MeetingRepo --> DB
    
    SocketHandler["Socket.io Event Handlers"] --> RoomManager["Room & Signaling Logic"]
```

## 6. Data Model
### 6.1 Data Model Definition
```mermaid
erDiagram
    USER {
        ObjectId _id
        String name
        String email
        String password
        String avatar
        Date createdAt
    }
    MEETING {
        ObjectId _id
        String roomId
        ObjectId hostId
        Boolean isActive
        Date createdAt
    }
    USER ||--o{ MEETING : hosts
```

### 6.2 Data Definition Language
```javascript
// Mongoose Schemas (Conceptual)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' }
}, { timestamps: true });

const meetingSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
```
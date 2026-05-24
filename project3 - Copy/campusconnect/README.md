# CampusConnect

An AI-powered platform to match college students for hackathons, startups, and group projects. It suggests compatible teammates and AI-generated project ideas.

## Tech Stack
- Frontend: React + Vite + TailwindCSS + Framer Motion
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- AI: OpenAI API (embeddings + chat completions)
- Auth: JWT
- Chat: Socket.io
- Hosting: Vercel (client) + Render (server)

## Monorepo Structure

campusconnect/
- client/ (React frontend)
- server/ (Express backend)

## Quick Start

1. Prerequisites
- Node.js 18+
- MongoDB connection string
- OpenAI API key

2. Server
```bash
cd server
npm install
cp .env.example .env
# edit .env with your values
npm run dev
```

3. Client
```bash
cd client
npm install
npm run dev
```

## Environment Variables (server/.env)
- PORT=5000
- MONGO_URI=your_mongodb_connection
- JWT_SECRET=super_secret_string
- OPENAI_API_KEY=sk-...
- CLIENT_ORIGIN=http://localhost:5173

## API Endpoints
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/users
- POST /api/match
- POST /api/ideas
- GET /api/chat/:peerId (history)

## Notes
- Matching uses cosine similarity on OpenAI embeddings where available, with graceful fallback to skills/interests vectors.
- Socket.io handles real-time chat; REST provides history.

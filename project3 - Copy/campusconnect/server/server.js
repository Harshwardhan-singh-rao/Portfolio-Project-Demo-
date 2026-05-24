import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import matchRoutes from './routes/match.js';
import ideaRoutes from './routes/ideas.js';
import chatRoutes from './routes/chat.js';
import { saveMessage } from './controllers/chatController.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: process.env.CLIENT_ORIGIN || '*', methods: ['GET', 'POST'] }
});

// DB
await connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('private-message', async ({ senderId, receiverId, message }) => {
    const msg = await saveMessage(senderId, receiverId, message);
    io.to(receiverId).emit('private-message', msg);
    io.to(senderId).emit('private-message', msg);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

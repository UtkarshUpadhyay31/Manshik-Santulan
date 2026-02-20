import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB, disconnectDB } from './utils/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import moodRoutes from './routes/moodRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import professionalRoutes from './routes/professionalRoutes.js';
import aiCoachRoutes from './routes/aiCoachRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import streakRoutes from './routes/streakRoutes.js';
import rewardRoutes from './routes/rewardRoutes.js';

// Handle Uncaught Exceptions (Synchronous errors)
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS blocked this origin'));
    }
  },
  credentials: true
}));

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Socket CORS blocked'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Try again later.' }
});
app.use('/api', limiter);

// Request Logging
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Socket.io Implementation
io.on('connection', (socket) => {
  socket.on('join-chat', (chatId) => socket.join(chatId));
  socket.on('send-message', (data) => {
    const { chatId, ...messageData } = data;
    io.to(chatId).emit('receive-message', { ...messageData, timestamp: new Date() });
  });
});

// Routes
app.get('/health', (req, res) => res.status(200).json({ status: 'UP', timestamp: new Date() }));
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/ai-coach', aiCoachRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api/rewards', rewardRoutes);

// 404 Handler
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Global Error Handler
app.use(errorHandler);

// Server Startup
const startServer = async () => {
  try {
    await connectDB();
    const server = httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Handle Unhandled Rejections (Asynchronous errors)
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      server.close(() => process.exit(1));
    });

    // Graceful Shutdown
    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  } catch (error) {
    console.error('Critical Failure during startup:', error);
    process.exit(1);
  }
};

startServer();

export default app;

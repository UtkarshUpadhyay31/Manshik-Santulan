import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './utils/db.js';
import { errorHandler } from './middleware/auth.js';

import authRoutes from './routes/authRoutes.js';
import moodRoutes from './routes/moodRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import professionalRoutes from './routes/professionalRoutes.js';
import aiCoachRoutes from './routes/aiCoachRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import streakRoutes from './routes/streakRoutes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 5000;

const staticAllowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

const devOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (staticAllowedOrigins.includes(origin)) return true;
  return devOriginPattern.test(origin);
};

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
  },
  credentials: true
};

const io = new Server(httpServer, {
  cors: {
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Socket origin blocked by CORS policy.'));
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(helmet({
  contentSecurityPolicy: false
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

app.use('/api', limiter);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} | Origin: ${req.headers.origin}`);
  next();
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on('send-message', (data) => {
    const { chatId, ...messageData } = data;
    io.to(chatId).emit('receive-message', {
      ...messageData,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Manshik Santulan API Server is Running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      mood: '/api/mood',
      admin: '/api/admin',
      professionals: '/api/professionals',
      aiCoach: '/api/ai-coach'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/ai-coach', aiCoachRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/streak', streakRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    try {
      await connectDB();
      console.log('MongoDB connected');
    } catch (dbError) {
      console.warn('MongoDB connection failed:', dbError.message);
      console.warn('Running in test mode without database');
    }

    httpServer.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
      console.log(`Environment: ${(process.env.NODE_ENV || 'development').toUpperCase()}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

startServer();

export default app;

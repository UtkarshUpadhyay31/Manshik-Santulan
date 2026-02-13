// Brain integrated - AI Coach Ready
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './utils/db.js';
import { errorHandler, requestLogger } from './middleware/auth.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import moodRoutes from './routes/moodRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import professionalRoutes from './routes/professionalRoutes.js';
import aiCoachRoutes from './routes/aiCoachRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// ============ Security Middleware ============
app.use(helmet({
  contentSecurityPolicy: false,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// Apply rate limiting to all requests
app.use('/api', limiter);

// Cors Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} | Origin: ${req.headers.origin}`);
  next();
});

// ============ Socket.io Setup ============
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on('send-message', (data) => {
    // data: { chatId, senderId, senderName, text }
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

// ============ Routes ============
app.get('/', (req, res) => {
  res.json({
    message: '✓ Manshik Santulan API Server is Running',
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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/ai-coach', aiCoachRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

// ============ Database Connection & Server Start ============
const startServer = async () => {
  try {
    try {
      await connectDB();
    } catch (dbError) {
      console.warn('\n⚠ MongoDB connection failed:', dbError.message);
      console.warn('⚠ Running in TEST MODE - Database features disabled\n');
    }

    httpServer.listen(PORT, () => {
      console.log(`\n╔════════════════════════════════════════════╗`);
      console.log(`║ 🧠 MANSHIK SANTULAN API SERVER RUNNING     ║`);
      console.log(`║ Port: ${PORT.toString().padEnd(39)} ║`);
      console.log(`║ Environment: ${process.env.NODE_ENV?.toUpperCase().padEnd(29)} ║`);
      console.log(`╚════════════════════════════════════════════╝\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n✓ Shutting down gracefully...');
  process.exit(0);
});

startServer();

export default app;

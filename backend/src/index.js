import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './utils/db.js';
import { errorHandler, requestLogger } from './middleware/auth.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import moodRoutes from './routes/moodRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import professionalRoutes from './routes/professionalRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// ============ Middleware ============
app.use(helmet({
  contentSecurityPolicy: false, // Disable for easier dev if needed
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger); // Request logging

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
      professionals: '/api/professionals'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/professionals', professionalRoutes);

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

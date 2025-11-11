// server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// ──────────────────────────────────────────────────────────────
// Load environment variables
// ──────────────────────────────────────────────────────────────
dotenv.config();

// ──────────────────────────────────────────────────────────────
// Initialize Express
// ──────────────────────────────────────────────────────────────
const app = express();

// ──────────────────────────────────────────────────────────────
// Security & Middleware
// ──────────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
        fontSrc: ["'self'", 'https:'],
      },
    },
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ──────────────────────────────────────────────────────────────
// Global rate limiter
// ──────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests from this IP. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// ──────────────────────────────────────────────────────────────
// Import Routes
// ──────────────────────────────────────────────────────────────
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

// ──────────────────────────────────────────────────────────────
// Mount Routes
// ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/seller', sellerRoutes); 
app.use('/api/categories', categoryRoutes);

// ──────────────────────────────────────────────────────────────
// Health Check
// ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
  });
});

// ──────────────────────────────────────────────────────────────
// GLOBAL 404 HANDLER – MUST BE AFTER ALL ROUTES
// ──────────────────────────────────────────────────────────────
app.all(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    timestamp: new Date().toISOString(),
    tip: 'Check your URL or API version',
  });
});

// ──────────────────────────────────────────────────────────────
// Global Error Handler – MUST BE LAST
// ──────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);

  // Mongoose validation
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: 'Validation Error', errors });
  }

  // Duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    return res.status(400).json({ success: false, message: `${field} '${value}' already exists` });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  // Default
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ──────────────────────────────────────────────────────────────
// MongoDB Connection – Clean & Modern
// ──────────────────────────────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Failed:', err.message);
    process.exit(1);
  }
};

connectDB();

// ──────────────────────────────────────────────────────────────
// Start Server with Graceful Shutdown
// ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API Base: http://localhost:${PORT}/api`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB disconnected');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const { connectDB } = require('./config/db');

// ─── Route imports ────────────────────────────────────────────────
const authRoutes     = require('./routes/auth');
const adminRoutes    = require('./routes/admin');
const electionRoutes = require('./routes/elections');
const voteRoutes     = require('./routes/votes');
const resultRoutes   = require('./routes/results');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ─────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ─── Body parsing ─────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Global rate limiter ──────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use(limiter);

// ─── Health check ─────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Secure E-Voting API is running.' });
});

// ─── API routes ───────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/votes',     voteRoutes);
app.use('/api/results',   resultRoutes);

// ─── 404 handler ──────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found.` });
});

// ─── Global error handler ─────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

// ─── Connect to MongoDB, then start server ────────────────────────
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB. Server not started.', err.message);
    process.exit(1);
  });

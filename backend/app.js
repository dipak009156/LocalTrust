require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── HTTP logger ──────────────────────────────────────────────────────────────
app.use(morgan('dev'));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/authRoute'));
app.use('/api/upload',  require('./routes/uploadRoute'));
app.use('/api/user',    require('./routes/userRoute'));
app.use('/api/worker',  require('./routes/workerRoute'));
app.use('/api/booking', require('./routes/bookingRoute'));
app.use('/api/dispute', require('./routes/disputeRoute'));
app.use('/api/admin',   require('./routes/adminRoute'));


// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// ─── Global error handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const logger = require('./utils/logger');
    logger.error('Unhandled error:', err);
    res.status(500).json({ message: 'Something went wrong' });
});

module.exports = app;

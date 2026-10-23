const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { mongoSanitizeMiddleware } = require('./middleware/security');
const { router: subscriptionsRouter } = require('./routes/subscriptions');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Trust proxy for accurate IP rate limiting behind Render / Cloudflare / Vercel
app.set('trust proxy', 1);

// Security Middleware
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' } // Allows Google OAuth popup window
  })
);

// CORS configuration - allow production domain, Vercel preview URLs, and localhost
const allowedOrigins = [
  'https://second-innings.in',
  'https://www.second-innings.in',
  'https://second-innings-indol.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body Parser with Raw Body Capture (Required for cryptographic Cashfree Webhook HMAC-SHA256 verification)
app.use(
  express.json({
    limit: '100kb',
    verify: (req, res, buf) => {
      if (buf && buf.length) {
        req.rawBody = buf.toString('utf8');
      }
    }
  })
);

// Strip NoSQL injection operators ($gt, $ne, etc.) from body, query, and params
app.use(mongoSanitizeMiddleware);

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/institutions', require('./routes/institutions'));
app.use('/api/opportunities', require('./routes/opportunities'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/support', require('./routes/support'));
app.use('/api/payment', require('./routes/payment'));

// Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Second Innings API', version: '2.0.0' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

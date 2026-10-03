const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet());

// Comprehensive CORS configuration supporting apex domain, www subdomain, vercel previews, and local dev
const allowedOrigins = [
  'https://second-innings.in',
  'https://www.second-innings.in',
  'http://localhost:3000',
  'http://localhost:3001',
];

if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(',').forEach(o => {
    const trimmed = o.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, server-to-server, curl)
    if (!origin) return callback(null, true);

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isDomainMatch = /^https:\/\/([a-zA-Z0-9-]+\.)?second-innings\.in$/.test(origin);
    const isVercelPreview = /^https:\/\/second-innings[a-zA-Z0-9-]*\.vercel\.app$/.test(origin);
    const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin);

    if (isExplicitlyAllowed || isDomainMatch || isVercelPreview || isLocalhost) {
      return callback(null, true);
    }

    // If FRONTEND_URL is set to wildcard
    if (process.env.FRONTEND_URL === '*') {
      return callback(null, true);
    }

    console.warn(`[CORS] Denied request from origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200 // For legacy browsers
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Ensure database is connected on serverless invocations
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Second Innings API' });
});

// Routes
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/institutions', require('./routes/institutions'));
app.use('/api/opportunities', require('./routes/opportunities'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/support', require('./routes/support'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;

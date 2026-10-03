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

// Flexible CORS for Vercel serverless and local dev
const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors({
  origin: allowedOrigin ? (allowedOrigin.includes(',') ? allowedOrigin.split(',').map(s => s.trim()) : allowedOrigin) : '*',
  credentials: true
}));

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

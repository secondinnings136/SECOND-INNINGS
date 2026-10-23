const mongoose = require('mongoose');

let cachedPromise = null;

const connectDB = async () => {
  // If already connected, return existing connection immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If already connecting, await that exact connection promise
  if (cachedPromise) {
    return cachedPromise;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const missingErr = new Error('MONGODB_URI environment variable is missing in project settings!');
    console.error(missingErr.message);
    throw missingErr;
  }

  cachedPromise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    })
    .then((conn) => {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    })
    .catch((err) => {
      cachedPromise = null;
      console.error(`Error connecting to MongoDB: ${err.message}`);
      throw err;
    });

  return cachedPromise;
};

// Reconnect on drop
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB connection lost. Clearing cached promise...');
  cachedPromise = null;
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
  cachedPromise = null;
});

module.exports = connectDB;

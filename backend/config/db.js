const mongoose = require('mongoose');

let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is missing!');
    return;
  }

  try {
    isConnecting = true;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging 10s+
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  } finally {
    isConnecting = false;
  }
};

// Auto-reconnect if connection drops
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB connection lost. Attempting auto-reconnect...');
  setTimeout(() => {
    connectDB().catch((err) => console.error('Auto-reconnect failed:', err.message));
  }, 2000);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

module.exports = connectDB;

// Serverless function handler for Vercel
const connectDB = require('../config/db');
const app = require('../server');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Vercel serverless DB connection error:', err.message);
  }
  return app(req, res);
};

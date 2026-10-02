const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// GET /api/newsletter - Get all subscribers
router.get('/', async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error) {
    next(error);
  }
});

// POST /api/newsletter - Subscribe
router.post('/', async (req, res, next) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    let subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (subscriber) {
      if (!subscriber.isActive) {
        subscriber.isActive = true;
        if (name) subscriber.name = name;
        await subscriber.save();
        return res.status(200).json({ success: true, message: 'Resubscribed successfully', data: subscriber });
      }
      return res.status(400).json({ success: false, error: 'Email is already subscribed' });
    }

    subscriber = await Newsletter.create({ email, name });
    res.status(201).json({ success: true, data: subscriber });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/newsletter/:email - Unsubscribe
router.delete('/:email', async (req, res, next) => {
  try {
    const subscriber = await Newsletter.findOneAndUpdate(
      { email: req.params.email.toLowerCase() },
      { isActive: false },
      { new: true }
    );
    if (!subscriber) {
      return res.status(404).json({ success: false, error: 'Subscriber not found' });
    }
    res.status(200).json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

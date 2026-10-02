const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST /api/bookings - Create booking / start conversation
router.post('/', async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Name and mobile number are required.' });
    }
    const bookingData = {
      ...req.body,
      userType: req.body.userType || 'student',
    };
    const booking = await Booking.create(bookingData);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
});

// GET /api/bookings - Get all bookings
router.get('/', async (req, res, next) => {
  try {
    const { status, userType } = req.query;
    const query = {};
    if (status) query.status = status;
    if (userType) query.userType = userType;
    
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
});

// GET /api/bookings/:id - Get single booking
router.get('/:id', async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/bookings/:id - Update booking
router.patch('/:id', async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

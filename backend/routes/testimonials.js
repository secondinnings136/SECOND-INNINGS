const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

// GET /api/testimonials/featured - Get featured testimonials
router.get('/featured', async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true, isFeatured: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
});

// GET /api/testimonials - Get approved testimonials (or all if all=true)
router.get('/', async (req, res, next) => {
  try {
    const { all } = req.query;
    const query = {};
    if (all !== 'true') {
      query.isApproved = true;
    }
    const testimonials = await Testimonial.find(query).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
});

// POST /api/testimonials - Submit testimonial
router.post('/', async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/testimonials/:id - Update testimonial
router.patch('/:id', async (req, res, next) => {
  try {
    const { isApproved, isFeatured, order, name, role, quote } = req.body;
    const updateData = {};
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (order !== undefined) updateData.order = order;
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (quote) updateData.quote = quote;

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }
    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/testimonials/:id - Delete testimonial
router.delete('/:id', async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }
    res.status(200).json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

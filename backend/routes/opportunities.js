const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');

// GET /api/opportunities/featured - Get featured opportunities
router.get('/featured', async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({ isActive: true, isFeatured: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: opportunities.length, data: opportunities });
  } catch (error) {
    next(error);
  }
});

// GET /api/opportunities - Get all active opportunities
router.get('/', async (req, res, next) => {
  try {
    const { category, locationMode, search, all, includeInactive } = req.query;
    const query = {};
    
    if (all !== 'true' && includeInactive !== 'true') {
      query.isActive = true;
    }
    
    if (category) query.category = category;
    if (locationMode) query.locationMode = locationMode;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const opportunities = await Opportunity.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: opportunities.length, data: opportunities });
  } catch (error) {
    next(error);
  }
});

// GET /api/opportunities/:id - Get single opportunity
router.get('/:id', async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ success: false, error: 'Opportunity not found' });
    }
    res.status(200).json({ success: true, data: opportunity });
  } catch (error) {
    next(error);
  }
});

// POST /api/opportunities - Create opportunity
router.post('/', async (req, res, next) => {
  try {
    const opportunity = await Opportunity.create(req.body);
    res.status(201).json({ success: true, data: opportunity });
  } catch (error) {
    next(error);
  }
});

// PUT /api/opportunities/:id - Update opportunity
router.put('/:id', async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!opportunity) {
      return res.status(404).json({ success: false, error: 'Opportunity not found' });
    }
    res.status(200).json({ success: true, data: opportunity });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/opportunities/:id - Soft delete
router.delete('/:id', async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!opportunity) {
      return res.status(404).json({ success: false, error: 'Opportunity not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

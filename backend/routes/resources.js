const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// GET /api/resources - Get resources (supports category filter, all=true for admin)
router.get('/', async (req, res, next) => {
  try {
    const { category, all, includeUnpublished } = req.query;
    const query = {};
    
    if (all !== 'true' && includeUnpublished !== 'true') {
      query.isPublished = true;
    }
    
    if (category) query.category = category;

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    next(error);
  }
});

// GET /api/resources/id/:id - Get single resource by ID (admin/edit)
router.get('/id/:id', async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }
    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
});

// GET /api/resources/:slug - Get single resource by slug (public)
router.get('/:slug', async (req, res, next) => {
  try {
    const resource = await Resource.findOne({ slug: req.params.slug, isPublished: true });
    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }
    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
});

// POST /api/resources - Create resource
router.post('/', async (req, res, next) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
});

// PUT /api/resources/:id - Update resource
router.put('/:id', async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }
    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/resources/:id - Delete resource
router.delete('/:id', async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }
    res.status(200).json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

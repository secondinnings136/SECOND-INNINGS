const express = require('express');
const router = express.Router();
const InstitutionalEnquiry = require('../models/InstitutionalEnquiry');

// POST /api/institutions - Submit institutional enquiry
router.post('/', async (req, res, next) => {
  try {
    const { institutionName, contactPerson, email, phone, enquiryNature } = req.body;
    if (!institutionName || !contactPerson || !email || !phone || !enquiryNature) {
      return res.status(400).json({ success: false, error: 'institutionName, contactPerson, email, phone, and enquiryNature are required.' });
    }
    const enquiry = await InstitutionalEnquiry.create(req.body);
    res.status(201).json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
});

// GET /api/institutions - Get all enquiries
router.get('/', async (req, res, next) => {
  try {
    const enquiries = await InstitutionalEnquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/institutions/:id - Update enquiry status
router.patch('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    const enquiry = await InstitutionalEnquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!enquiry) {
      return res.status(404).json({ success: false, error: 'Enquiry not found' });
    }
    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

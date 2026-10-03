const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');

// POST /api/support - Submit a website issue / support request
router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, description } = req.body;
    if (!name || !email || !subject || !description) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, subject, and description are required.' 
      });
    }

    const ticket = await SupportTicket.create(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Support ticket submitted successfully. Our technical team has received your report.', 
      data: ticket 
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/support - Get all support tickets (admin view with filters)
router.get('/', async (req, res, next) => {
  try {
    const { status, category, priority } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (category && category !== 'all') filter.category = category;
    if (priority && priority !== 'all') filter.priority = priority;

    const tickets = await SupportTicket.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      count: tickets.length, 
      data: tickets 
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/support/:id - Get single ticket
router.get('/:id', async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Support ticket not found' });
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/support/:id - Update ticket status, priority, or adminNotes
router.patch('/:id', async (req, res, next) => {
  try {
    const { status, priority, adminNotes } = req.body;
    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (priority !== undefined) updateFields.priority = priority;
    if (adminNotes !== undefined) updateFields.adminNotes = adminNotes;

    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Support ticket not found' });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/support/:id - Remove support ticket
router.delete('/:id', async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Support ticket not found' });
    }
    res.status(200).json({ success: true, message: 'Ticket removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

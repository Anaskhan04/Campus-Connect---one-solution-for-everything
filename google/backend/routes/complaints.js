const express = require('express');
const router = express.Router();
const complaintService = require('../services/complaintService');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { complaintSchema, complaintStatusSchema, validate } = require('../validation/authSchema');

// Get all complaints for the logged-in user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit) || 10;
    const result = await complaintService.getComplaintsByUsername(req.user.username, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get all complaints (for faculty/admin)
router.get('/all', authMiddleware, requireRole('faculty'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit) || 10;
    const result = await complaintService.getAllComplaints(page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get complaint by ID
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id, req.user);
    res.json(complaint);
  } catch (error) {
    next(error);
  }
});

// Create complaint
router.post('/', authMiddleware, validate(complaintSchema), async (req, res, next) => {
  try {
    const complaint = await complaintService.createComplaint(req.body, req.user.username);
    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
});

// Update complaint status (for faculty)
router.put(
  '/:id/status',
  authMiddleware,
  requireRole('faculty'),
  validate(complaintStatusSchema),
  async (req, res, next) => {
    try {
      const complaint = await complaintService.updateComplaintStatus(
        req.params.id,
        req.body.status
      );
      res.json(complaint);
    } catch (error) {
      next(error);
    }
  }
);

// Delete complaint
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const result = await complaintService.deleteComplaint(req.params.id, req.user.username);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

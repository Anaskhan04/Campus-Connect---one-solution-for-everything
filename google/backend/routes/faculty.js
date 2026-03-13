const express = require('express');
const router = express.Router();
const facultyService = require('../services/facultyService');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { facultyProfileSchema, validate } = require('../validation/authSchema');

// Get all faculty
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = parseInt(req.query.limit) || 10;
    const { q, branch } = req.query;

    const filter = {};
    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { name: regex },
        { username: regex },
        { designation: regex },
        { research: regex }
      ];
    }
    if (branch && branch !== 'all') filter.branch = branch;

    const result = await facultyService.getAllFaculty(page, limit, filter);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get faculty by username
router.get('/:username', authMiddleware, async (req, res, next) => {
  try {
    const faculty = await facultyService.getFacultyByUsername(req.params.username);
    res.json(faculty);
  } catch (error) {
    next(error);
  }
});

// Create faculty profile
router.post(
  '/',
  authMiddleware,
  requireRole('faculty'),
  validate(facultyProfileSchema),
  async (req, res, next) => {
    try {
      const faculty = await facultyService.createFaculty(req.user.username, req.body);
      res.status(201).json(faculty);
    } catch (error) {
      next(error);
    }
  }
);

// Update faculty profile
router.put('/:username', authMiddleware, validate(facultyProfileSchema), async (req, res, next) => {
  try {
    if (req.params.username !== req.user.username) {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    const faculty = await facultyService.updateFaculty(req.params.username, req.body);
    res.json(faculty);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

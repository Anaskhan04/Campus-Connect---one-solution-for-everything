const express = require('express');
const router = express.Router();
const alumniService = require('../services/alumniService');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { alumniSchema, validate } = require('../validation/authSchema');

// Get all alumni
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit) || 10;
    const result = await alumniService.getAllAlumni(page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Seed dummy alumni data (for development/testing)
router.post('/seed', authMiddleware, requireRole(['admin', 'faculty']), async (req, res, next) => {
  try {
    const result = await alumniService.seedDummyAlumni();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Create alumni profile
router.post('/', authMiddleware, validate(alumniSchema), async (req, res, next) => {
  try {
    const alumniData = {
      ...req.body,
      username: req.body.username || req.user.username,
    };
    const alumni = await alumniService.createAlumni(alumniData);
    res.status(201).json(alumni);
  } catch (error) {
    next(error);
  }
});

// Update alumni profile
router.put('/:id', authMiddleware, validate(alumniSchema), async (req, res, next) => {
  try {
    const updatedAlumni = await alumniService.updateAlumni(req.params.id, req.body, req.user);
    res.json(updatedAlumni);
  } catch (error) {
    next(error);
  }
});

// Delete alumni profile
router.delete('/:id', authMiddleware, requireRole(['admin', 'faculty']), async (req, res, next) => {
  try {
    const result = await alumniService.deleteAlumni(req.params.id, req.user);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

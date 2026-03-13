const express = require('express');
const router = express.Router();
const subjectService = require('../services/subjectService');
const authMiddleware = require('../middleware/auth');

// Get all subjects for user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const subjects = await subjectService.getSubjects(req.user.username);
    res.json(subjects);
  } catch (error) {
    next(error);
  }
});

// Create subject
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const subject = await subjectService.createSubject(req.user.username, req.body);
    res.status(201).json(subject);
  } catch (error) {
    next(error);
  }
});

// Seed default subjects
router.post('/seed', authMiddleware, async (req, res, next) => {
  try {
    const subjects = await subjectService.seedDefaultSubjects(req.user.username, req.body.subjects);
    res.json(subjects);
  } catch (error) {
    next(error);
  }
});

// Delete subject
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const result = await subjectService.deleteSubject(req.params.id, req.user.username);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

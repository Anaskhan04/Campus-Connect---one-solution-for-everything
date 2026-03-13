const express = require('express');
const router = express.Router();
const studentService = require('../services/studentService');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { studentProfileSchema, validate } = require('../validation/authSchema');

// Get all students
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = parseInt(req.query.limit) || 10;
    const { q, year, branch } = req.query;
    
    const filter = {};
    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { name: regex },
        { username: regex },
        { skills: regex },
        { rollNo: regex }
      ];
    }
    if (year && year !== 'all') filter.year = parseInt(year);
    if (branch && branch !== 'all') filter.branch = branch;

    const result = await studentService.getAllStudents(page, limit, filter);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get student by username
router.get('/:username', authMiddleware, async (req, res, next) => {
  try {
    const student = await studentService.getStudentByUsername(req.params.username);
    res.json(student);
  } catch (error) {
    next(error);
  }
});

// Create student profile
router.post('/', authMiddleware, validate(studentProfileSchema), async (req, res, next) => {
  try {
    const student = await studentService.createStudentProfile(req.body, req.user.username);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
});

// Update student profile
router.put('/:username', authMiddleware, validate(studentProfileSchema), async (req, res, next) => {
  try {
    const student = await studentService.updateStudentProfile(
      req.params.username,
      req.body,
      req.user
    );
    res.json(student);
  } catch (error) {
    next(error);
  }
});

// Delete student profile
router.delete('/:username', authMiddleware, requireRole('faculty'), async (req, res, next) => {
  try {
    const result = await studentService.deleteStudentProfile(req.params.username);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

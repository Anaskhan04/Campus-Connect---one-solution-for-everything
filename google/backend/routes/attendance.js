const express = require('express');
const router = express.Router();
const attendanceService = require('../services/attendanceService');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { attendanceSchema, validate } = require('../validation/authSchema');

// Get attendance for a student
router.get('/:username', authMiddleware, async (req, res, next) => {
  try {
    const attendance = await attendanceService.getAttendanceByUsername(
      req.params.username,
      req.user
    );
    res.json(attendance);
  } catch (error) {
    next(error);
  }
});

// Get attendance statistics
router.get('/:username/stats', authMiddleware, async (req, res, next) => {
  try {
    const stats = await attendanceService.getAttendanceStats(req.params.username, req.user);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// Get attendance by subject
router.get('/:username/:subjectId', authMiddleware, async (req, res, next) => {
  try {
    const attendance = await attendanceService.getAttendanceBySubject(
      req.params.username,
      req.params.subjectId,
      req.user
    );
    res.json(attendance);
  } catch (error) {
    next(error);
  }
});

// Add attendance record
router.post('/', authMiddleware, validate(attendanceSchema), async (req, res, next) => {
  try {
    const attendance = await attendanceService.addAttendanceRecord(req.body, req.user);
    res.status(201).json(attendance);
  } catch (error) {
    next(error);
  }
});

// Update attendance record
router.put('/:id', authMiddleware, validate(attendanceSchema), async (req, res, next) => {
  try {
    const updatedAttendance = await attendanceService.updateAttendanceRecord(
      req.params.id,
      req.body,
      req.user
    );
    res.json(updatedAttendance);
  } catch (error) {
    next(error);
  }
});

// Delete attendance record
router.delete('/:id', authMiddleware, requireRole('faculty'), async (req, res, next) => {
  try {
    const result = await attendanceService.deleteAttendanceRecord(req.params.id, req.user);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

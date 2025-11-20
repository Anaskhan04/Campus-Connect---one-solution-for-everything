const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/auth');

// Get attendance for a student
router.get('/:username', authMiddleware, async (req, res) => {
  try {
    // Students can only view their own attendance
    if (req.params.username !== req.user.username && req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const attendance = await Attendance.find({ username: req.params.username })
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance by subject
router.get('/:username/:subjectId', authMiddleware, async (req, res) => {
  try {
    if (req.params.username !== req.user.username && req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const attendance = await Attendance.find({
      username: req.params.username,
      subjectId: req.params.subjectId
    }).sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add attendance record
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { username, subjectId, subjectName, date, status } = req.body;

    // Faculty can add for any student, students can only add for themselves
    if (username !== req.user.username && req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const attendance = new Attendance({
      username,
      subjectId,
      subjectName,
      date: new Date(date),
      status
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update attendance record
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    // Only faculty can update, or students can update their own
    if (attendance.username !== req.user.username && req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete attendance record
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    // Only faculty can delete
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendance record deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance statistics
router.get('/:username/stats', authMiddleware, async (req, res) => {
  try {
    if (req.params.username !== req.user.username && req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const attendance = await Attendance.find({ username: req.params.username });
    
    // Group by subject
    const stats = {};
    attendance.forEach(record => {
      if (!stats[record.subjectId]) {
        stats[record.subjectId] = {
          subjectId: record.subjectId,
          subjectName: record.subjectName,
          total: 0,
          present: 0,
          absent: 0,
          percentage: 0
        };
      }
      stats[record.subjectId].total++;
      if (record.status === 'present') {
        stats[record.subjectId].present++;
      } else {
        stats[record.subjectId].absent++;
      }
    });

    // Calculate percentages
    Object.keys(stats).forEach(subjectId => {
      const stat = stats[subjectId];
      stat.percentage = stat.total > 0 
        ? Math.round((stat.present / stat.total) * 100) 
        : 0;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


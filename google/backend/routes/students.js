const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const authMiddleware = require('../middleware/auth');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student by username
router.get('/:username', async (req, res) => {
  try {
    const student = await Student.findOne({ username: req.params.username });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create student profile
router.post('/', authMiddleware, async (req, res) => {
  try {
    const studentData = req.body;
    studentData.username = req.user.username;

    const existingStudent = await Student.findOne({ username: studentData.username });
    if (existingStudent) {
      return res.status(400).json({ error: 'Student profile already exists' });
    }

    const student = new Student(studentData);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student profile
router.put('/:username', authMiddleware, async (req, res) => {
  try {
    // Only allow users to update their own profile
    if (req.params.username !== req.user.username && req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const student = await Student.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete student profile
router.delete('/:username', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const student = await Student.findOneAndDelete({ username: req.params.username });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student profile deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


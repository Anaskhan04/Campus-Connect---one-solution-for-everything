const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');
const authMiddleware = require('../middleware/auth');

// Get all faculty
router.get('/', async (req, res) => {
  try {
    const faculty = await Faculty.find().sort({ createdAt: -1 });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get faculty by username
router.get('/:username', async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ username: req.params.username });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create faculty profile
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const facultyData = req.body;
    facultyData.username = req.user.username;

    const existingFaculty = await Faculty.findOne({ username: facultyData.username });
    if (existingFaculty) {
      return res.status(400).json({ error: 'Faculty profile already exists' });
    }

    const faculty = new Faculty(facultyData);
    await faculty.save();
    res.status(201).json(faculty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update faculty profile
router.put('/:username', authMiddleware, async (req, res) => {
  try {
    if (req.params.username !== req.user.username) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const faculty = await Faculty.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      { new: true, runValidators: true }
    );

    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    res.json(faculty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


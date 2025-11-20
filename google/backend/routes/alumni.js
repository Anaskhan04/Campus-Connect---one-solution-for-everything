const express = require('express');
const router = express.Router();
const Alumni = require('../models/Alumni');
const authMiddleware = require('../middleware/auth');

// Get all alumni
router.get('/', async (req, res) => {
  try {
    const alumni = await Alumni.find().sort({ createdAt: -1 });
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed dummy alumni data (for development/testing)
router.post('/seed', async (req, res) => {
  try {
    const dummyAlumni = [
      { username: 'alumni_rahul', name: 'Rahul Verma', branch: 'Information Technology', year: 2022, currentRole: 'Software Engineer', company: 'Google', email: 'rahul.v@example.com', linkedin: 'https://linkedin.com/in/rahulverma' },
      { username: 'alumni_sneha', name: 'Sneha Reddy', branch: 'Electrical Engineering', year: 2021, currentRole: 'Hardware Engineer', company: 'Intel', email: 'sneha.r@example.com', linkedin: 'https://linkedin.com/in/snehareddy' },
      { username: 'alumni_arjun', name: 'Arjun Mehta', branch: 'Mechanical Engineering', year: 2020, currentRole: 'Design Engineer', company: 'Tesla', email: 'arjun.m@example.com', linkedin: 'https://linkedin.com/in/arjunmehta' },
      { username: 'alumni_priya', name: 'Priya Jain', branch: 'Information Technology', year: 2023, currentRole: 'Data Scientist', company: 'Microsoft', email: 'priya.j@example.com', linkedin: 'https://linkedin.com/in/priyajain' }
    ];

    // Check which dummy alumni already exist
    const existingUsernames = await Alumni.find({ 
      username: { $in: dummyAlumni.map(a => a.username) } 
    }).select('username');
    const existingUsernamesSet = new Set(existingUsernames.map(a => a.username));

    // Only insert dummy alumni that don't exist
    const alumniToInsert = dummyAlumni.filter(a => !existingUsernamesSet.has(a.username));
    
    if (alumniToInsert.length > 0) {
      await Alumni.insertMany(alumniToInsert);
      res.json({ 
        message: 'Dummy alumni data seeded successfully', 
        inserted: alumniToInsert.length,
        total: await Alumni.countDocuments()
      });
    } else {
      res.json({ 
        message: 'All dummy alumni already exist', 
        total: await Alumni.countDocuments()
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create alumni profile
router.post('/', authMiddleware, async (req, res) => {
  try {
    const alumniData = {
      ...req.body,
      username: req.body.username || req.user.username
    };
    const alumni = new Alumni(alumniData);
    await alumni.save();
    res.status(201).json(alumni);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update alumni profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);

    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }

    // Students can only update their own profile, faculty can update any
    if (req.user.role !== 'faculty' && alumni.username !== req.user.username) {
      return res.status(403).json({ error: 'Unauthorized: You can only update your own profile' });
    }

    const updatedAlumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedAlumni);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete alumni profile
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);

    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }

    // Students can only delete their own profile, faculty can delete any
    if (req.user.role !== 'faculty' && alumni.username !== req.user.username) {
      return res.status(403).json({ error: 'Unauthorized: You can only delete your own profile' });
    }

    await Alumni.findByIdAndDelete(req.params.id);
    res.json({ message: 'Alumni profile deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


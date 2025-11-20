const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = new User({ username, password, role });
    await user.save();
    
    res.status(201).json({ message: 'Signup successful! You can now log in.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.findOne({ username, role });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username, password, or role.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username, password, or role.' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      user: { 
        username: user.username, 
        role: user.role, 
        profileImage: user.profileImage 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile image
// UPDATE PROFILE IMAGE
router.put('/profile-image', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { profileImage } = req.body;

    if (!profileImage) {
      return res.status(400).json({ error: "No image provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true }
    );

    res.json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      user: { 
        username: user.username, 
        role: user.role, 
        profileImage: user.profileImage 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


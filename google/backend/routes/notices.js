const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const authMiddleware = require('../middleware/auth');

// Get all notices
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notice by ID
router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    res.json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create notice (faculty only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Only faculty can create notices' });
    }

    const noticeData = {
      ...req.body,
      createdBy: req.user.username,
      date: req.body.date || new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };

    const notice = new Notice(noticeData);
    await notice.save();
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update notice
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    res.json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete notice
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    res.json({ message: 'Notice deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


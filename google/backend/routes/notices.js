const express = require('express');
const router = express.Router();
const noticeService = require('../services/noticeService');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { noticeSchema, validate } = require('../validation/authSchema');

// Get all notices
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = parseInt(req.query.limit) || 10;
    const result = await noticeService.getAllNotices(page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get notice by ID
router.get('/:id', async (req, res, next) => {
  try {
    const notice = await noticeService.getNoticeById(req.params.id);
    res.json(notice);
  } catch (error) {
    next(error);
  }
});

// Create notice (faculty only)
router.post(
  '/',
  authMiddleware,
  requireRole('faculty'),
  validate(noticeSchema),
  async (req, res, next) => {
    try {
      const notice = await noticeService.createNotice(req.body, req.user.username);
      res.status(201).json(notice);
    } catch (error) {
      next(error);
    }
  }
);

// Update notice
router.put(
  '/:id',
  authMiddleware,
  requireRole('faculty'),
  validate(noticeSchema),
  async (req, res, next) => {
    try {
      const notice = await noticeService.updateNotice(req.params.id, req.body);
      res.json(notice);
    } catch (error) {
      next(error);
    }
  }
);

// Delete notice
router.delete('/:id', authMiddleware, requireRole('faculty'), async (req, res, next) => {
  try {
    const result = await noticeService.deleteNotice(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

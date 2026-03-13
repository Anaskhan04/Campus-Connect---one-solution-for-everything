const express = require('express');
const router = express.Router();
const searchService = require('../services/searchService');

// Global search
router.get('/', async (req, res, next) => {
  try {
    const keyword = req.query.q;
    const limit = parseInt(req.query.limit) || 5;

    const results = await searchService.search(keyword, limit);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

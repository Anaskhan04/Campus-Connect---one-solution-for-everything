const express = require('express');
const router = express.Router();
const resourceService = require('../services/resourceService');
const authMiddleware = require('../middleware/auth');
const { resourceSchema, validate } = require('../validation/authSchema');

// Get all resources
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = parseInt(req.query.limit) || 10;
    const { branch, year, q } = req.query;

    const filter = {};
    if (branch && branch !== 'all') filter.branch = branch;
    if (year && year !== 'all') filter.year = year;
    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { title: regex },
        { description: regex }
      ];
    }

    const result = await resourceService.getAllResources(page, limit, filter);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Create resource
router.post('/', authMiddleware, validate(resourceSchema), async (req, res, next) => {
  try {
    const resource = await resourceService.createResource(req.body, req.user.username);
    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
});

// Update resource
router.put('/:id', authMiddleware, validate(resourceSchema), async (req, res, next) => {
  try {
    const resource = await resourceService.updateResource(req.params.id, req.body, req.user);
    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// Delete resource
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const result = await resourceService.deleteResource(req.params.id, req.user);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

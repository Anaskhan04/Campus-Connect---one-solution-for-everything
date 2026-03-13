const express = require('express');
const router = express.Router();
const eventService = require('../services/eventService');
const authMiddleware = require('../middleware/auth');
const { eventSchema, validate } = require('../validation/authSchema');

// Get all events
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit) || 10;
    const result = await eventService.getAllEvents(page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get event by ID
router.get('/:id', async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.json(event);
  } catch (error) {
    next(error);
  }
});

// Create event
router.post('/', authMiddleware, validate(eventSchema), async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body, req.user.username);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
});

// Update event
router.put('/:id', authMiddleware, validate(eventSchema), async (req, res, next) => {
  try {
    const updatedEvent = await eventService.updateEvent(req.params.id, req.body, req.user);
    res.json(updatedEvent);
  } catch (error) {
    next(error);
  }
});

// Delete event
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const result = await eventService.deleteEvent(req.params.id, req.user);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

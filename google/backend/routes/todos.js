const express = require('express');
const router = express.Router();
const todoService = require('../services/todoService');
const authMiddleware = require('../middleware/auth');
const { todoSchema, validate } = require('../validation/authSchema');

// Get all todos for the logged-in user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const todos = await todoService.getTodos(req.user.username);
    res.json(todos);
  } catch (error) {
    next(error);
  }
});

// Create todo
router.post('/', authMiddleware, validate(todoSchema), async (req, res, next) => {
  try {
    const todo = await todoService.createTodo(req.user.username, req.body.text);
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
});

// Update todo
router.put('/:id', authMiddleware, validate(todoSchema), async (req, res, next) => {
  try {
    const updatedTodo = await todoService.updateTodo(req.params.id, req.user.username, req.body);
    res.json(updatedTodo);
  } catch (error) {
    next(error);
  }
});

// Delete todo
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const result = await todoService.deleteTodo(req.params.id, req.user.username);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

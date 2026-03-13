const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { validateSignup, loginSchema, validate } = require('../validation/authSchema');

// Google OAuth callback redirect
router.get('/google/callback', (req, res) => {
  res.redirect('/index.html');
});

// Signup
router.post(
  '/signup',
  authMiddleware.optionalAuthMiddleware,
  validateSignup,
  authController.signup
);

// Login
router.post('/login', validate(loginSchema), authController.login);

// Google Login
router.post('/google', authController.googleLogin);

// Update profile image
router.put('/profile-image', authMiddleware, authController.updateProfileImage);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;

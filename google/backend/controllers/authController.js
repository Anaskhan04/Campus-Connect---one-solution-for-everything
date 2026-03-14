const authService = require('../services/authService');

class AuthController {
  async signup(req, res, next) {
    try {
      const { username, password, role } = req.body;
      await authService.signupUser(username, password, role, req.user);
      res.status(201).json({ success: true, message: 'Signup successful! You can now log in.' });
    } catch (error) {
      if (
        error.message === 'Username already exists' ||
        error.message === 'Admin accounts cannot be created through signup.'
      ) {
        error.statusCode = 400;
      }
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { username, password, role } = req.body;
      const { user, token } = await authService.loginUser(username, password, role);

      res.json({
        success: true,
        token,
        user: {
          username: user.username,
          role: user.role,
          profileImage: user.profileImage,
          isProfileSetup: user.isProfileSetup,
        },
      });
    } catch (error) {
      if (error.message === 'Invalid username, password, or role.') {
        error.statusCode = 401;
      }
      next(error);
    }
  }

  async googleLogin(req, res, next) {
    try {
      const { credential } = req.body;
      const { user, token } = await authService.googleLogin(credential);

      res.json({
        success: true,
        token,
        user: {
          username: user.username,
          role: user.role,
          profileImage: user.profileImage,
          isProfileSetup: user.isProfileSetup,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const updatedUser = await authService.updateProfile(userId, req.body);
      res.json({ 
        success: true, 
        message: 'Profile updated successfully',
        user: {
          username: updatedUser.username,
          role: updatedUser.role,
          profileImage: updatedUser.profileImage,
          isProfileSetup: updatedUser.isProfileSetup
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async updateProfileImage(req, res, next) {
    try {
      const userId = req.user.userId;
      const { profileImage } = req.body;

      if (!profileImage) {
        const error = new Error('No image provided');
        error.statusCode = 400;
        throw error;
      }

      const updatedUser = await authService.updateProfileImage(userId, profileImage);
      res.json({ success: true, user: updatedUser });
    } catch (err) {
      next(err);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.username);
      res.json({
        success: true,
        user: {
          username: user.username,
          role: user.role,
          profileImage: user.profileImage,
          isProfileSetup: user.isProfileSetup,
        },
      });
    } catch (error) {
      if (error.message === 'User not found') {
        error.statusCode = 404;
      }
      next(error);
    }
  }
}

module.exports = new AuthController();

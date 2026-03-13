const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthService {
  async signupUser(username, password, role, requester = null) {
    const lowerUsername = username.toLowerCase();
    const existingUser = await User.findOne({ username: lowerUsername });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const isAdminRequester = requester?.role === 'admin';

    if (role === 'admin' && !isAdminRequester) {
      throw new Error('Admin accounts cannot be created through signup.');
    }

    // Determine assigned role:
    // 1. If requester is admin, accept any valid role they provide.
    // 2. If it's a public signup, allow 'student' ONLY.
    let assignedRole = 'student';
    
    if (isAdminRequester && role) {
      assignedRole = role;
    }
    
    const user = new User({ username: lowerUsername, password, role: assignedRole });
    await user.save();
    return user;
  }

  async loginUser(username, password, role) {
    const lowerUsername = username.toLowerCase();
    console.log(`[AuthService] Login attempt: ${lowerUsername} as ${role}`);
    
    // Find user by username only first to provide better debugging/error handling
    const user = await User.findOne({ username: lowerUsername });
    
    if (!user) {
      console.log(`[AuthService] User not found: ${lowerUsername}`);
      throw new Error('Invalid username, password, or role.');
    }

    console.log(`[AuthService] User found. DB role: ${user.role}, Requested: ${role}`);

    // Verify role matches
    if (user.role !== role) {
      console.log(`[AuthService] Role mismatch for ${lowerUsername}`);
      throw new Error('Invalid username, password, or role.');
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`[AuthService] Password mismatch for ${lowerUsername}`);
      throw new Error('Invalid username, password, or role.');
    }

    console.log(`[AuthService] Login successful for ${lowerUsername}`);
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { user, token };
  }

  async updateProfileImage(userId, profileImage) {
    const updatedUser = await User.findByIdAndUpdate(userId, { profileImage }, { new: true });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  }

  async getCurrentUser(username) {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new AuthService();

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {
  async googleLogin(idToken) {
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const { sub: googleId, email, name, picture } = payload;

      let user = await User.findOne({ 
        $or: [{ googleId }, { email: email.toLowerCase() }] 
      });

      if (!user) {
        // Create new student user if not found
        // Use part of email as username if name is not unique enough
        const baseUsername = email.split('@')[0].toLowerCase();
        let uniqueUsername = baseUsername;
        let counter = 1;

        while (await User.findOne({ username: uniqueUsername })) {
          uniqueUsername = `${baseUsername}${counter}`;
          counter++;
        }

        user = new User({
          username: uniqueUsername,
          email: email.toLowerCase(),
          googleId,
          role: 'student', // Default role for Google login
          profileImage: picture,
        });
        await user.save();
      } else if (!user.googleId) {
        // Link Google account to existing email account
        user.googleId = googleId;
        if (!user.profileImage) user.profileImage = picture;
        await user.save();
      }

      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return { user, token };
    } catch (error) {
      console.error('Google Verification Error:', error);
      throw new Error('Google authentication failed');
    }
  }

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

  async updateProfile(userId, profileData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update user basic info
    if (profileData.profileImage) user.profileImage = profileData.profileImage;
    user.isProfileSetup = true;
    await user.save();

    // Create or Update Student/Faculty record
    if (user.role === 'student') {
      const Student = require('../models/Student');
      await Student.findOneAndUpdate(
        { username: user.username },
        { 
          ...profileData,
          username: user.username,
          email: profileData.email || user.email,
          year: parseInt(profileData.year),
          skills: Array.isArray(profileData.skills) 
            ? profileData.skills 
            : profileData.skills?.split(',').map(s => s.trim()).filter(s => s !== '')
        },
        { upsert: true, new: true }
      );
    } else if (user.role === 'faculty') {
      const Faculty = require('../models/Faculty');
      await Faculty.findOneAndUpdate(
        { username: user.username },
        { 
          ...profileData,
          username: user.username,
          email: profileData.email || user.email
        },
        { upsert: true, new: true }
      );
    }

    return user;
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

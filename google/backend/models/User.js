const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allow multiple nulls if not using Google
    trim: true,
    lowercase: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: function() { return !this.googleId; }, // Only required if not a Google user
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    required: true,
  },
  profileImage: {
    type: String,
    default: null,
  },
  isProfileSetup: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Error in comparePassword:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);

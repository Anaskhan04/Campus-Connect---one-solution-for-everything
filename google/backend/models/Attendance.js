const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  subjectId: {
    type: String,
    required: true,
  },
  subjectName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['attended', 'missed', 'cancelled'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
attendanceSchema.index({ username: 1, subjectId: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);

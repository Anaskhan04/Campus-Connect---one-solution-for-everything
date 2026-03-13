const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Theory', 'Lab', 'Workshop', 'Other'],
    default: 'Theory'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subject', subjectSchema);

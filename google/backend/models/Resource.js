const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileData: {
    type: String, // Store as base64 or URL
    required: true,
  },
  uploadedBy: {
    type: String, // username
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Text index for search
resourceSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Resource', resourceSchema);

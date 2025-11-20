const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  tag: { 
    type: String, 
    required: true,
    enum: ['All', 'Department', 'Urgent']
  },
  date: { 
    type: String, 
    required: true 
  },
  attachment: { 
    type: String,
    default: null
  },
  attachmentName: { 
    type: String,
    default: null
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Notice', noticeSchema);


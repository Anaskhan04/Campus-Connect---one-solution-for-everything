const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { 
    type: String, 
    required: true,
    index: true
  },
  type: { 
    type: String, 
    required: true,
    enum: ['complaint', 'event', 'notice', 'general']
  },
  title: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  complaintId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint'
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Notification', notificationSchema);



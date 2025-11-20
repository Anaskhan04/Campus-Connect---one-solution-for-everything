const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  subCategory: { 
    type: String,
    default: ''
  },
  subject: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

complaintSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);


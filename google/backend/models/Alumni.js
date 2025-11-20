const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  name: { 
    type: String, 
    required: true 
  },
  branch: { 
    type: String, 
    required: true 
  },
  year: { 
    type: Number, 
    required: true 
  },
  currentRole: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String,
    default: ''
  },
  linkedin: { 
    type: String,
    default: ''
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Alumni', alumniSchema);


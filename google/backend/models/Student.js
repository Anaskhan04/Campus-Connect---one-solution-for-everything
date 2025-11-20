const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  name: { 
    type: String, 
    required: true 
  },
  rollNo: { 
    type: String, 
    required: true,
    unique: true
  },
  year: { 
    type: Number, 
    required: true,
    min: 1,
    max: 4
  },
  branch: { 
    type: String, 
    required: true 
  },
  intro: { 
    type: String,
    default: ''
  },
  skills: { 
    type: [String],
    default: []
  },
  email: { 
    type: String,
    default: ''
  },
  linkedin: { 
    type: String,
    default: ''
  },
  github: { 
    type: String,
    default: ''
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

studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Student', studentSchema);


const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Todo', todoSchema);


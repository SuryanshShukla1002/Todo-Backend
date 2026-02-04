const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  dueDate: {
    type: Date
  },
  category: {
    type: String,
    enum: ['Urgent', 'Non-Urgent'],
    required: [true, 'Category is required']
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
todoSchema.index({ user: 1 });
todoSchema.index({ category: 1 });
todoSchema.index({ completed: 1 });

module.exports = mongoose.model('Todo', todoSchema);
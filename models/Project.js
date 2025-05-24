/**
 * Project model
 * A "project" groups campaigns under one business or product.
 */

const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add an owner ID']
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: false,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index on ownerId and createdAt
ProjectSchema.index({ ownerId: 1, createdAt: -1 });

module.exports = mongoose.model('Project', ProjectSchema);

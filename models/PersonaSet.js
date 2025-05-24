/**
 * PersonaSet model
 * A reusable bundle of personas that can be used across multiple campaigns.
 */

const mongoose = require('mongoose');

const PersonaSetSchema = new mongoose.Schema({
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
    maxlength: [5000, 'Description cannot be more than 500 characters']
  },
  sampleSize: {
    type: Number,
    default: 500,
    max: [1000, 'Sample size cannot be more than 1000']
  },
  segmentationGrid: {
    type: Object,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index on ownerId for efficient querying
PersonaSetSchema.index({ ownerId: 1 });

module.exports = mongoose.model('PersonaSet', PersonaSetSchema);

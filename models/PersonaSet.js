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
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index on ownerId for efficient querying
PersonaSetSchema.index({ ownerId: 1 });

module.exports = mongoose.model('PersonaSet', PersonaSetSchema);

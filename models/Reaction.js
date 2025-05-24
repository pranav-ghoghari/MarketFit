/**
 * Reaction model
 * Stores each persona's response to a campaign. Keeps the persona doc lean.
 */

const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: [true, 'Please add a campaign ID']
  },
  personaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Persona',
    required: [true, 'Please add a persona ID']
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating cannot be more than 10']
  },
  sentiment: {
    type: String,
    required: [true, 'Please add a sentiment'],
    enum: ['very bad', 'bad', 'neutral', 'good', 'very good']
  },
  feedback: {
    type: String,
    required: [true, 'Please add feedback'],
    maxlength: [2000, 'Feedback cannot be more than 2000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create recommended indexes
ReactionSchema.index({ campaignId: 1 });
ReactionSchema.index({ personaId: 1 });
ReactionSchema.index({ campaignId: 1, rating: -1 });

module.exports = mongoose.model('Reaction', ReactionSchema);

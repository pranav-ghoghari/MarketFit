/**
 * Campaign model
 * One marketing post/idea that you'll test against personas from one or more persona sets.
 */

const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Please add a project ID']
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  copy: {
    type: String,
    maxlength: [5000, 'Copy cannot be more than 5000 characters']
  },
  targetDescription: {
    type: String,
    maxlength: [5000, 'Target description cannot be more than 2000 characters']
  },
  sampleSize: {
    type: Number,
    default: 500,
    max: [1000, 'Sample size cannot be more than 1000']
  },
  personaSetIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PersonaSet'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index on projectId and createdAt as recommended
CampaignSchema.index({ projectId: 1, createdAt: -1 });

module.exports = mongoose.model('Campaign', CampaignSchema);

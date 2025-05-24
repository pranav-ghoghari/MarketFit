/**
 * Persona model
 * Each persona is generated per campaign. We keep them flat for easy indexing and querying.
 */

const mongoose = require('mongoose');

const PersonaSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: [true, 'Please add a campaign ID']
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  segmentation: {
    roles: {
      type: [String],
      default: []
    },
    demographics: {
      ageRange: {
        type: String,
        required: false
      },
      regions: {
        type: [String],
        default: []
      },
      languages: {
        type: [String],
        default: []
      }
    },
    psychographics: {
      motivations: {
        type: [String],
        default: []
      },
      hobbies: {
        type: [String],
        default: []
      },
      purchaseDrivers: {
        type: [String],
        default: []
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index on campaignId as recommended
PersonaSchema.index({ campaignId: 1 });

module.exports = mongoose.model('Persona', PersonaSchema);

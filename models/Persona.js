/**
 * Persona model
 * Each persona belongs to a persona set and can be reused across multiple campaigns.
 */

const mongoose = require('mongoose');

const PersonaSchema = new mongoose.Schema({
  setId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PersonaSet',
    required: [true, 'Please add a persona set ID']
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
  backstory: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index on setId as recommended
PersonaSchema.index({ setId: 1 });

module.exports = mongoose.model('Persona', PersonaSchema);

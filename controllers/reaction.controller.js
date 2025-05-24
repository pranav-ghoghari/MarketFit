const { inngest } = require('../config/inngest');
const Persona = require('../models/Persona');
const Campaign = require('../models/Campaign');

/**
 * Generate reactions for all personas in a set for a specific campaign
 * @route POST /api/reactions
 * @access Public
 */
exports.generateReactions = async (req, res) => {
  try {
    const { campaignId, copy, personaSetId } = req.body;
    
    if (!campaignId || !copy || !personaSetId) {
      return res.status(400).json({
        success: false,
        message: 'campaignId, copy, and personaSetId are required'
      });
    }
    
    // Check if the campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Check if the persona set exists and has personas
    const personaCount = await Persona.countDocuments({ setId: personaSetId });
    
    if (personaCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No personas found for the given personaSetId'
      });
    }
    
    // Queue the batch processing job
    await inngest.send({
      name: 'reaction/batch-generate',
      data: { campaignId, copy, personaSetId }
    });
    
    res.status(200).json({
      success: true,
      message: `Reaction generation started for ${personaCount} personas`,
      campaignId,
      personaSetId,
      personaCount
    });
  } catch (error) {
    console.error('Error in generateReactions:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating reactions',
      error: error.message
    });
  }
};

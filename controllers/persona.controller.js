const { inngest } = require('../config/inngest');
const Persona = require('../models/Persona');

/**
 * Generate backstories for all personas in a set
 * @route POST /api/personas/generate-backstories
 * @access Public
 */
exports.generatePersonaBackstories = async (req, res) => {
  try {
    const { personasetId } = req.body;
    
    if (!personasetId) {
      return res.status(400).json({
        success: false,
        message: 'personasetId is required'
      });
    }
    
    // Check if the persona set exists and has personas
    const personaCount = await Persona.countDocuments({ setId: personasetId });
    
    if (personaCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No personas found for the given personasetId'
      });
    }
    
    // Queue the batch processing job
    await inngest.send({
      name: 'persona/batch-generate-backstories',
      data: { personasetId }
    });
    
    res.status(200).json({
      success: true,
      message: `Backstory generation started for ${personaCount} personas`,
      personasetId,
      personaCount
    });
  } catch (error) {
    console.error('Error in generatePersonaBackstories:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating persona backstories',
      error: error.message
    });
  }
};

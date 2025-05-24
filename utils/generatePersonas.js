/**
 * Persona Generation Utility
 * Converts segmentation grids into evenly distributed personas according to sample size
 */

const Persona = require('../models/Persona');

/**
 * Generate evenly distributed personas from a segmentation grid
 * @param {Object} segmentationGrid - The segmentation grid object
 * @param {String} setId - The ID of the PersonaSet
 * @param {Number} sampleSize - The desired sample size (default: 500)
 * @returns {Promise<Array>} - Array of created Persona documents
 */
const generatePersonas = async (segmentationGrid, setId, sampleSize = 500) => {
  try {
    if (!segmentationGrid || !setId) {
      throw new Error('Segmentation grid and setId are required');
    }

    // Extract all possible values from the segmentation grid
    const roles = segmentationGrid.segmentation.roles || [];
    const ageRanges = segmentationGrid.demographics.ageRange || [];
    const regions = segmentationGrid.demographics.regions || [];
    const languages = segmentationGrid.demographics.languages || [];
    const motivations = segmentationGrid.psychographic.motivations || [];
    const hobbies = segmentationGrid.psychographic.hobbies || [];
    const purchaseDrivers = segmentationGrid.psychographic.purchaseDrivers || [];

    // Calculate all possible combinations
    const combinations = [];
    
    // For each role
    for (const role of roles) {
      // For each age range
      for (const ageRange of ageRanges) {
        // For each region
        for (const region of regions) {
          // For each language
          for (const language of languages) {
            // For each motivation
            for (const motivation of motivations) {
              // For each hobby
              for (const hobby of hobbies) {
                // For each purchase driver
                for (const purchaseDriver of purchaseDrivers) {
                  combinations.push({
                    role,
                    ageRange,
                    region,
                    language,
                    motivation,
                    hobby,
                    purchaseDriver
                  });
                }
              }
            }
          }
        }
      }
    }

    // If we have more combinations than the sample size, select a representative subset
    let selectedCombinations = combinations;
    if (combinations.length > sampleSize) {
      // Calculate how many combinations to select
      const step = Math.max(1, Math.floor(combinations.length / sampleSize));
      selectedCombinations = [];
      
      // Select combinations at regular intervals
      for (let i = 0; i < combinations.length && selectedCombinations.length < sampleSize; i += step) {
        selectedCombinations.push(combinations[i]);
      }
    }

    // Create personas from the selected combinations
    const personas = [];
    for (let i = 0; i < selectedCombinations.length; i++) {
      const combo = selectedCombinations[i];
      
      // Create a name for the persona based on its attributes
      const name = `${combo.role} (${combo.ageRange}, ${combo.region})`;
      
      // Create the persona object
      const personaData = {
        setId,
        name,
        segmentation: {
          roles: [combo.role],
          demographics: {
            ageRange: combo.ageRange,
            regions: [combo.region],
            languages: [combo.language]
          },
          psychographics: {
            motivations: [combo.motivation],
            hobbies: [combo.hobby],
            purchaseDrivers: [combo.purchaseDriver]
          }
        }
      };
      
      // Create the persona in the database
      const persona = await Persona.create(personaData);
      personas.push(persona);
    }

    return personas;
  } catch (error) {
    console.error('Error generating personas:', error);
    throw error;
  }
};

module.exports = { generatePersonas };

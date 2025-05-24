const { inngest } = require('../config/inngest');

/**
 * Test processing a single prompt with OpenRouter via Inngest
 * @route POST /api/inngest-api/test-single
 * @access Public
 */
exports.testSinglePrompt = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prompt is required' 
      });
    }

    // Send an event to Inngest
    await inngest.send({
      name: 'openrouter/process',
      data: { prompt }
    });

    res.status(200).json({ 
      success: true, 
      message: 'Prompt processing started' 
    });
  } catch (error) {
    console.error('Error in testSinglePrompt:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing prompt', 
      error: error.message 
    });
  }
};

/**
 * Test batch processing multiple prompts with OpenRouter via Inngest
 * @route POST /api/inngest-api/test-batch
 * @access Public
 */
exports.testBatchPrompts = async (req, res) => {
  try {
    const { prompts } = req.body;

    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prompts array is required' 
      });
    }

    // Send a batch event to Inngest
    await inngest.send({
      name: 'openrouter/batch-process',
      data: { prompts }
    });

    res.status(200).json({ 
      success: true, 
      message: `Batch processing started for ${prompts.length} prompts` 
    });
  } catch (error) {
    console.error('Error in testBatchPrompts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing batch prompts', 
      error: error.message 
    });
  }
};

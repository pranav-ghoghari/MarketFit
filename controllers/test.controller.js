/**
 * Test controller for the /test endpoint
 * This controller handles operations for the market_fit_collection
 */

const MarketFit = require('../models/MarketFit');
const OpenAI = require('openai');

// Test endpoint to add data to market_fit_collection
exports.testAddData = async (req, res, next) => {
  try {
    // Create a new document using the data from the request body
    const marketFitData = new MarketFit(req.body);

    // Save the document to the database
    const savedData = await marketFitData.save();

    return res.status(201).json({
      success: true,
      message: 'Data successfully added to market_fit_collection',
      data: savedData
    });
  } catch (error) {
    console.error('Error in testAddData:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add data to market_fit_collection',
      error: error.message
    });
  }
};

// Get all data from market_fit_collection
exports.getAllData = async (req, res, next) => {
  try {
    // Fetch all documents from the collection
    const allData = await MarketFit.find();

    return res.status(200).json({
      success: true,
      count: allData.length,
      data: allData
    });
  } catch (error) {
    console.error('Error in getAllData:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve data from market_fit_collection',
      error: error.message
    });
  }
};

// Test OpenRouter connection with Cerebras
exports.testOpenRouter = async (req, res, next) => {
  try {
    // Initialize OpenAI with OpenRouter configuration
    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    // Get prompt from request body or use default
    const userPrompt = req.body.prompt || "What is the capital of France?";

    // Send request to Cerebras via OpenRouter
    const response = await openai.chat.completions.create({
      model: "qwen/qwen3-32b",
      provider: { only: ["Cerebras"] },
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userPrompt }
      ],
    });

    // Extract the response content
    const responseContent = response.choices[0].message.content;

    // Create a new MarketFit document to store the test results
    const marketFitData = new MarketFit({
      name: "OpenRouter Cerebras Test",
      description: `Test prompt: "${userPrompt}" - Response: "${responseContent.substring(0, 490)}"`,
      value: response.usage?.total_tokens || 0,
      isActive: true
    });

    // Save the document to the database
    const savedData = await marketFitData.save();

    return res.status(200).json({
      success: true,
      message: 'OpenRouter test completed successfully',
      prompt: userPrompt,
      response: responseContent,
      data: savedData
    });
  } catch (error) {
    console.error('Error in testOpenRouter:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to test OpenRouter connection',
      error: error.message
    });
  }
};

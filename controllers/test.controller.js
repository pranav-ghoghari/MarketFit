/**
 * Test controller for the /test endpoint
 * This controller handles operations for the market_fit_collection
 */

const MarketFit = require('../models/MarketFit');

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

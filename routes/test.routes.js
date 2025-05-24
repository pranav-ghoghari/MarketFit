/**
 * Test routes for the /test endpoint
 */

const express = require('express');
const router = express.Router();
const { testAddData, getAllData, testOpenRouter } = require('../controllers/test.controller');

// POST /api/test - Add data to market_fit_collection
router.post('/', testAddData);

// GET /api/test - Get all data from market_fit_collection
router.get('/', getAllData);

// POST /api/test/openrouter - Test OpenRouter connection with Cerebras
router.post('/openrouter', testOpenRouter);

module.exports = router;

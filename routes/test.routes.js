/**
 * Test routes for the /test endpoint
 */

const express = require('express');
const router = express.Router();
const { testAddData, getAllData } = require('../controllers/test.controller');

// POST /api/test - Add data to market_fit_collection
router.post('/', testAddData);

// GET /api/test - Get all data from market_fit_collection
router.get('/', getAllData);

module.exports = router;

const express = require('express');
const router = express.Router();

// Import route modules
const testRoutes = require('./test.routes');

// Define base routes
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Use imported route modules
router.use('/test', testRoutes);

module.exports = router;

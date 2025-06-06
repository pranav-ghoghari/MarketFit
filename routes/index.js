const express = require('express');
const router = express.Router();

// Import route modules
const testRoutes = require('./test.routes');
const inngestRoutes = require('./inngest.routes');
const projectsRoutes = require('./projects');
const campaignsRoutes = require('./campaigns');
const personasRoutes = require('./personas');
const reactionsRoutes = require('./reactions');

// Define base routes
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Use imported route modules
router.use('/test', testRoutes);
router.use('/inngest-api', inngestRoutes);
router.use('/projects', projectsRoutes);
router.use('/campaigns', campaignsRoutes);
router.use('/personas', personasRoutes);
router.use('/reactions', reactionsRoutes);

module.exports = router;

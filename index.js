const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const connectDB = require('./config/database');
const { serve } = require('inngest/express');
const { inngest } = require('./config/inngest');

// Import Inngest functions
const openRouterFunctions = require('./functions/inngest/openrouter');
const reactionFunctions = require('./functions/inngest/reactions');

// Import routes
const routes = require('./routes');

// Initialize express app
const app = express();
const PORT = config.port;

// Middleware
app.use(cors(config.cors));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MarketFit API' });
});

// Inngest endpoint
app.use('/api/inngest', serve({ 
  client: inngest,
  signingKey: process.env.INNGEST_SIGNING_KEY,
  functions: [
    ...Object.values(openRouterFunctions),
    ...Object.values(reactionFunctions)
  ]
}));

// API Routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: config.nodeEnv === 'production' ? {} : err
  });
});

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running in ${config.nodeEnv} mode on port ${PORT}`);
  });
});

module.exports = app;

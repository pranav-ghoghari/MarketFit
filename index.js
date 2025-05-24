const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const connectDB = require('./config/database');

// Import routes
const routes = require('./routes');

// Initialize express app
const app = express();
const PORT = config.port;

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MarketFit API' });
});

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

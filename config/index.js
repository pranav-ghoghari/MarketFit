/**
 * Application configuration
 */

// Load environment variables from .env file in non-production environments
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database configuration
  database: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/marketfit',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  // JWT configuration (example)
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },

  // Cors configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  }
};

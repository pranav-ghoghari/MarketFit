const { Inngest } = require('inngest');
const { serve } = require('inngest/express');

// Initialize the Inngest client
const inngest = new Inngest({ 
  id: 'marketfit-app',
  // Add your Inngest signing key from environment variables
  signingKey: process.env.INNGEST_SIGNING_KEY
});

module.exports = { inngest, serve };

/**
 * MarketFit model
 * This model represents the market_fit_collection in MongoDB
 */

const mongoose = require('mongoose');

const MarketFitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: false,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  value: {
    type: Number,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MarketFit', MarketFitSchema, 'market_fit_collection');

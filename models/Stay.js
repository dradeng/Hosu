const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const StaySchema = new Schema({
  post: {
    type: String,
    default: null
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null
  },
  landlord: {
    type: String,
    default: null
  },
  subtenant: {
    type: String,
    default: null
  },
  decided: {
    type: Boolean,
    default: false
  },
  approved: {
    type: Boolean,
    default: false
  },
  landlordImage: {
    type: String,
    requied: true
  },
  subtenantImage: {
    type: String,
    required: true
  }
});

module.exports = Stay = mongoose.model('stays', StaySchema);
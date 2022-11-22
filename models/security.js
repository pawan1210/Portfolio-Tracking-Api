const mongoose = require("mongoose");

const securitySchema = new mongoose.Schema({
  average_price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  security_type: {
    type: String,
  },
  ticker_symbol: {
    type: String,
  },
});

module.exports = securitySchema;

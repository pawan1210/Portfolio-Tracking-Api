const mongoose = require("mongoose");

const { statusType, tradeType, securityType } = require("../utils/constants");

const tradeSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    portfolio_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: [statusType.SUCCESS, statusType.FAILED, statusType.VOIDED],
      default: statusType.SUCCESS,
    },
    trade_type: {
      type: String,
      required: true,
      enum: [tradeType.BUY, tradeType.SELL],
    },
    security_type: {
      type: String,
      required: true,
      enum: [securityType.STOCK],
    },
    ticker_symbol: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Trade = mongoose.model("Trade", tradeSchema);

module.exports = Trade;

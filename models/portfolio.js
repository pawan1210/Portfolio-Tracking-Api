const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    securities: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      required: true,
    },
    trades: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Trade",
      default: [],
    },
  },
  { timestamps: true }
);

portfolioSchema.index({ user_id: 1 });
const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;

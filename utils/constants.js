const statusType = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  VOIDED: "VOIDED",
};

const tradeType = {
  BUY: "BUY",
  SELL: "SELL",
};

const securityType = {
  STOCK: "STOCK",
};

const err = {
  MONGO_SERVER_ERROR: "MongoServerError",
};

module.exports = { statusType, tradeType, securityType, err };

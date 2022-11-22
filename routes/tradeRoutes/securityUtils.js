const mongoose = require("mongoose");

const { tradeType } = require("../../utils/constants");

const ZERO = 0;
const ObjectId = mongoose.Types.ObjectId;

function updateSecurity(security, trade) {
  security = updateSecurityWithTradeType(security, trade);
  if (security.quantity >= 0) {
    return {
      isUpdated: true,
    };
  } else {
    return {
      isUpdated: false,
      message: "Not enough security to sell",
    };
  }
}

function updateSecurityWithTradeType(security, trade) {
  if (trade.trade_type == tradeType.BUY) {
    security.average_price =
      (trade.price * trade.quantity +
        security.average_price * security.quantity) /
      (security.quantity + trade.quantity);
    security.quantity = security.quantity + trade.quantity;
  } else {
    security.quantity = security.quantity - trade.quantity;
  }

  return security;
}

// if security is not present, create new one with tradeData (request body)
function getOrCreateSecurity(securities, tradeData) {
  let securityId = Object.keys(securities).find((_) => {
    return (
      securities[_]?.security_type === tradeData?.security_type &&
      securities[_]?.ticker_symbol === tradeData?.ticker_symbol
    );
  });

  if (!securityId) {
    securityId = new ObjectId();
    let security = {
      ...tradeData,
      average_price: ZERO,
      quantity: ZERO,
    };
    delete security.price;
    securities[securityId] = security;
  }
  return securityId;
}

// While updating the security, check if the securities are different.
// It is checked by getting current security_type and ticker_symbol and those
// passed in the request.
function checkIfSecuritiesAreDifferent(tradeData, updatedTradeData) {
  return (
    tradeData?.security_type == updatedTradeData?.security_type &&
    tradeData?.ticker_symbol == updatedTradeData?.ticker_symbol
  );
}

module.exports = {
  getOrCreateSecurity,
  updateSecurity,
  checkIfSecuritiesAreDifferent,
};

const db = require("../../models");
const { statusType } = require("../../utils/constants");
const portfolioDao = require("./portfolioDao");

async function getSecurities(req) {
  const portfolio = await portfolioDao.getPortfolioByIdPopulated(
    req.params.portfolioId
  );

  if (portfolio) {
    const securities = getFormattedSecurities(
      portfolio.securities,
      portfolio.trades
    );
    return {
      status: 200,
      securities,
    };
  } else {
    return {
      status: 400,
      message: `Portfolio with id - ${req.params.portfolioId} doesn't exists`,
    };
  }
}

function getFormattedSecurities(securities, trades) {
  trades = trades.filter((trade) => {
    return trade.status === statusType.SUCCESS;
  });

  let formattedSecurities = {};
  trades.forEach((trade) => {
    if (trade?.ticker_symbol) {
      if (trade.ticker_symbol in formattedSecurities) {
        formattedSecurities[trade.ticker_symbol].push(getFormattedTrade(trade));
      } else {
        formattedSecurities[trade.ticker_symbol] = [getFormattedTrade(trade)];
      }
    } else {
      if (trade.security_type in formattedSecurities) {
        formattedSecurities[trade.security_type].push(getFormattedTrade(trade));
      } else {
        formattedSecurities[trade.security_type] = [getFormattedTrade(trade)];
      }
    }
  });

  return Object.keys(securities).map((key) => {
    let security = securities[key];
    if (security?.ticker_symbol in formattedSecurities) {
      security["trades"] = formattedSecurities[security.ticker_symbol];
    } else {
      security["trades"] = formattedSecurities[security.security_type];
    }
    return security;
  });
}

function getFormattedTrade(trade) {
  return {
    ticker_symbol: trade?.ticker_symbol,
    security_type: trade.security_type,
    price: trade.price,
    trade_type: trade.trade_type,
    quantity: trade.quantity,
    unit: trade.unit,
    status: trade.status,
  };
}

module.exports = {
  getSecurities,
};

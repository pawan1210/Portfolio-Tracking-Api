const db = require("../../models");
const logger = require("../../utils/logger");
const tradeDao = require("./tradeDao");
const portfolioDao = require("../portfolioRoutes/portfolioDao");
const securityUtils = require("./securityUtils");
const { statusType, err: ERROR, tradeType } = require("../../utils/constants");

async function createTrade(req) {
  try {
    const portfolio = await portfolioDao.getPortfolioById(
      req.body.portfolio_id
    );
    if (!portfolio) {
      return {
        status: 400,
        message: "Portfolio doesn't exists",
      };
    }
    const securityId = securityUtils.getOrCreateSecurity(
      portfolio.securities,
      req.body
    );
    const newTrade = new db.Trade(req.body);
    const { isUpdated, message } = securityUtils.updateSecurity(
      portfolio.securities[securityId],
      req.body
    );
    if (!isUpdated) {
      return {
        status: 400,
        message,
      };
    }
    portfolio.trades.push(newTrade);
    portfolio.markModified("securities");
    await portfolio.save();
    await newTrade.save();
    return {
      status: 201,
      trade: newTrade,
      message: "Trade successful",
    };
  } catch (err) {
    logger.warn(`${req.route.path} failed due to ${err}`);
    if (err.name === ERROR.MONGO_SERVER_ERROR) {
      return {
        status: 400,
        message: `Portfolio creation failed due to ${err}`,
      };
    } else {
      return {
        status: 500,
        message: "Server error, please try again!",
      };
    }
  }
}

async function updateTrade(req) {
  try {
    const trade = await tradeDao.getTradeById(req.params.tradeId);
    if (!trade) {
      return {
        status: 400,
        message: `Trade with id - ${req.params.tradeId} doesn't exists`,
      };
    }

    const portfolio = await portfolioDao.getPortfolioById(trade.portfolio_id);
    const { isUpdated, isRemovedMessage, isSecurityUpdatedMessage } =
      updateSecurityAndTrade(portfolio.securities, trade, req.body);

    if (isUpdated) {
      portfolio.markModified("securities");
      await trade.save();
      await portfolio.save();
      return {
        status: 200,
        trade,
      };
    } else {
      return {
        status: 400,
        message: isRemovedMessage || isSecurityUpdatedMessage,
      };
    }
  } catch (err) {
    logger.warn(`${req.route.path} failed due to ${err}`);
    return {
      status: 500,
      message: "Server error, please try again!",
    };
  }
}

function updateSecurityAndTrade(securities, tradeData, updatedTradeData) {
  let currentSecurityId = securityUtils.getOrCreateSecurity(
    securities,
    tradeData
  );
  const { isRemoved, message: isRemovedMessage } = removeTradeFromSecurity(
    securities[currentSecurityId],
    tradeData
  );
  let isTradeUpdated = updateCurrentTrade(tradeData, updatedTradeData);

  currentSecurityId = securityUtils.getOrCreateSecurity(securities, tradeData);

  let { isUpdated, message: isSecurityUpdatedMessage } =
    securityUtils.updateSecurity(securities[currentSecurityId], tradeData);

  return {
    isUpdated: isRemoved && isTradeUpdated && isUpdated,
    isRemovedMessage,
    isSecurityUpdatedMessage,
  };
}

function removeTradeFromSecurity(security, trade) {
  const sign = trade.trade_type === tradeType.BUY ? 1 : -1;
  const quantity = security.quantity;
  const newAveragePrice =
    (security.average_price * quantity - sign * trade.price * trade.quantity) /
    (quantity - sign * trade.quantity);

  security.quantity = quantity - sign * trade.quantity;
  security.average_price = newAveragePrice ? newAveragePrice : 0;

  if (security.quantity < 0) {
    return {
      isRemoved: false,
      message: "Not enough quantity to remove",
    };
  }
  return {
    isRemoved: true,
  };
}

function updateCurrentTrade(tradeData, updatedTradeData) {
  if (updatedTradeData?.trade_type) {
    tradeData.trade_type = updatedTradeData?.trade_type;
  }
  if (updatedTradeData?.ticker_symbol) {
    tradeData.ticker_symbol = updatedTradeData.ticker_symbol;
  }
  if (updatedTradeData?.price) {
    tradeData.price = updatedTradeData?.price;
  }
  if (updatedTradeData?.quantity) {
    tradeData.quantity = updatedTradeData.quantity;
  }
  return true;
}

async function removeTrade(req) {
  try {
    const trade = await tradeDao.getTradeById(req.params.tradeId);
    if (!trade) {
      return {
        status: 400,
        message: `Trade with id ${req.params.tradeId} doesn't exists`,
      };
    }
    const portfolio = await portfolioDao.getPortfolioById(trade.portfolio_id);
    const securityId = securityUtils.getOrCreateSecurity(
      portfolio.securities,
      trade
    );
    const { isRemoved, message } = removeTradeFromSecurity(
      portfolio.securities[securityId],
      trade
    );
    if (isRemoved) {
      portfolio.markModified("securities");
      trade.status = statusType.VOIDED;
      await trade.save();
      await portfolio.save();
      return {
        status: 200,
        message: `Trade with id ${req.params.tradeId} removed successfully`,
      };
    } else {
      return {
        status: 400,
        message,
      };
    }
  } catch (err) {
    logger.warn(`${req.route.path} failed due to ${err}`);
    return {
      status: 500,
      message: "Server error, please try again!",
    };
  }
}

module.exports = {
  createTrade,
  updateTrade,
  removeTrade,
};

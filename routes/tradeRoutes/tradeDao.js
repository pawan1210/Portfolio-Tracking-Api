const db = require("../../models");
const logger = require("../../utils/logger");

async function getTradeById(tradeId) {
  try {
    const trade = await db.Trade.findById(tradeId);
    return trade;
  } catch (err) {
    logger.warn(`Trade fetch failed due to ${err}`);
    return null;
  }
}

module.exports = {
  getTradeById,
};

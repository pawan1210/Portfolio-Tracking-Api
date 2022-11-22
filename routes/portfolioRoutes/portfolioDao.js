const db = require("../../models");
const logger = require("../../utils/logger");

async function getPortfolioById(portfolioId) {
  try {
    const portfolio = await db.Portfolio.findById(portfolioId);
    return portfolio;
  } catch (err) {
    logger.warn(`Portfolio fetch failed due to ${err}`);
    return null;
  }
}

async function getPortfolioByIdPopulated(portfolioId) {
  try {
    const portfolio = await db.Portfolio.findById(portfolioId).populate(
      "trades"
    );
    return portfolio;
  } catch (err) {
    logger.warn(`Portfolio fetch failed due to ${err}`);
    return null;
  }
}

module.exports = {
  getPortfolioById,
  getPortfolioByIdPopulated,
};

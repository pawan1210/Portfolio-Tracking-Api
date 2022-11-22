const logger = require("../../utils/logger");
const db = require("../../models");

const portfolioDao = require("./portfolioDao");
const userDao = require("../userRoutes/userDao");
const { err: ERROR } = require("../../utils/constants");

async function createPortfolio(req) {
  try {
    const user = await userDao.getUserById(req.body.user_id);
    if (user) {
      const newPortfolio = await db.Portfolio.create(req.body);
      return {
        status: 201,
        portfolio: newPortfolio,
        message: "Portfolio created successfully",
      };
    } else {
      return {
        status: 400,
        message: "Invalid user",
      };
    }
  } catch (err) {
    logger.warn(`${req.route.path} - Portfolio creation failed due to ${err}`);
    if (err.name === ERROR.MONGO_SERVER_ERROR) {
      return {
        status: 400,
        message: `Portfolio creation failed due to ${err}`,
      };
    }
    return {
      status: 500,
      message: "Server error, please try again!",
    };
  }
}

async function getPortfolio(req) {
  const portfolio = await portfolioDao.getPortfolioById(req.params.portfolioId);
  if (portfolio) {
    return {
      status: 200,
      title: portfolio.title,
      securities: portfolio.securities,
    };
  } else {
    return {
      status: 400,
      message: `Portfolio with id - ${req.params.portfolioId} doesn't exists`,
    };
  }
}

async function getReturns(req) {
  const portfolio = await portfolioDao.getPortfolioById(req.params.portfolioId);
  if (!portfolio) {
    return {
      status: 400,
      message: `Portfolio with id - ${req.params.portfolioId} doesn't exists`,
    };
  } else {
    const portfolioReturn = Object.keys(portfolio.securities).reduce(
      (sum, key) => {
        let security = portfolio.securities[key];
        return (sum += (100 - security.average_price) * security.quantity);
      },
      0
    );

    return {
      status: 200,
      portfolioReturn,
    };
  }
}

module.exports = {
  createPortfolio,
  getPortfolio,
  getReturns,
};

const express = require("express");
const router = express.Router();

const utils = require("./utils");
const securityUtils = require("./securityUtils");
const middleware = require("../middleware");
const { requestValidation } = require("./middleware");

router.post(
  "",
  [requestValidation, middleware.verifyJwtToken],
  async (req, res) => {
    const { status, portfolio, message } = await utils.createPortfolio(req);
    return res.status(status).json({
      portfolio,
      message,
    });
  }
);

router.get("/:portfolioId", middleware.verifyJwtToken, async (req, res) => {
  const { status, securities, message, title } = await utils.getPortfolio(req);
  return res.status(status).json({
    title,
    securities,
    message,
  });
});

router.get(
  "/:portfolioId/get-securities",
  middleware.verifyJwtToken,
  async (req, res) => {
    const { status, securities, message } = await securityUtils.getSecurities(
      req
    );
    return res.status(status).json({
      securities,
      message,
    });
  }
);

router.get(
  "/:portfolioId/get-returns",
  middleware.verifyJwtToken,
  async (req, res) => {
    const { status, portfolioReturn, message } = await utils.getReturns(req);
    return res.status(status).json({
      portfolio_return: portfolioReturn,
      message,
    });
  }
);

module.exports = router;

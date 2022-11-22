const express = require("express");
const router = express.Router();
const utils = require("./tradeUtils");
const { verifyJwtToken } = require("../middleware");
const { requestValidation } = require("./middleware");

router.post("", [requestValidation, verifyJwtToken], async (req, res) => {
  const { status, trade, message } = await utils.createTrade(req);
  return res.status(status).json({
    message,
    trade,
  });
});

router.patch(
  "/:tradeId",
  [requestValidation, verifyJwtToken],
  async (req, res) => {
    const { status, trade, message } = await utils.updateTrade(req);
    return res.status(status).json({
      message,
      trade,
    });
  }
);

router.delete("/:tradeId", async (req, res) => {
  const { status, trade, message } = await utils.removeTrade(req);
  return res.status(status).json({
    message,
  });
});

module.exports = router;

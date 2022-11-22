const express = require("express");
const router = express.Router();
const utils = require("./tradeUtils");
const { verifyJwtToken } = require("../middleware");
const { requestValidation } = require("./middleware");

router.post("", [requestValidation, verifyJwtToken], async (req, res) => {
  /*
   Steps
   1. Validate the request using yup schema and verify the jwt token.
   2. Fetch portfolio. If not present return with error message.
   3. Get or create the security using security_type and ticker_symbol.
   4. Add trade to security by updating it's quantity and average_price.
   5. If any error (negative quantity) reutrn with error code.
  */
  const { status, trade, message } = await utils.createTrade(req);
  return res.status(status).json({
    message,
    trade,
  });
});

router.patch(
  "/:tradeId",
  [requestValidation, verifyJwtToken],

  /*
   Steps
   1. Fetch portfolio. If not present return with error message.
   2. If trade is getting updated, it's security will also be updated.
   3. Fetch the security.
   4. Remove trade from security.
   5. If trade was of type SELL, quantity will be increased else decreased to remove.
   5. Update the trade with updated data.
   6. Fetch security to update. It can be current security or a new one as ticker_symbol 
      might get updated.
   7. Add trade to new security. (Again it can be current security also).

   Note - removeSecurity and addSecurity are common functions used by by
          update and delete API.
  */

  async (req, res) => {
    const { status, trade, message } = await utils.updateTrade(req);
    return res.status(status).json({
      message,
      trade,
    });
  }
);

router.delete("/:tradeId", async (req, res) => {
  /*
   Steps
   1. Get trade.
   2. Get security and remove the trade if possible.
  */
  const { status, trade, message } = await utils.removeTrade(req);
  return res.status(status).json({
    message,
  });
});

module.exports = router;

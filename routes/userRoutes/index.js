const express = require("express");

const utils = require("./utils");
const middleware = require("./middleware");

const router = express.Router();

router.post("/register", middleware.requestValidation, async (req, res) => {
  /*
   Create user with unique email id.
  */
  const { user, message, status } = await utils.registerUser(req);
  res.status(status).json({
    user,
    message,
  });
});

router.post("/login", middleware.requestValidation, async (req, res) => {
  /*
   Login is required as it will generate a jwt-token 
   for all the other requests. It will be a static token only
   without any expiry time.
  */
  const { token, message, status, user } = await utils.loginUser(req);
  res.status(status).json({
    token,
    message,
    user,
  });
});

module.exports = router;

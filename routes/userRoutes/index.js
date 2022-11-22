const express = require("express");

const utils = require("./utils");
const middleware = require("./middleware");

const router = express.Router();

router.post("/register", middleware.requestValidation, async (req, res) => {
  const { user, message, status } = await utils.registerUser(req);
  res.status(status).json({
    user,
    message,
  });
});

router.post("/login", middleware.requestValidation, async (req, res) => {
  const { token, message, status, user } = await utils.loginUser(req);
  res.status(status).json({
    token,
    message,
    user,
  });
});

module.exports = router;

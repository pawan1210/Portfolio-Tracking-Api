const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const logger = require("../utils/logger");

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const verifyJwtToken = (req, res, next) => {
  try {
    const token = req.header("token");
    const isVerified = jwt.verify(token, jwtSecretKey);
    if (!isVerified) {
      res.status(401).json({
        message: "Invalid authentication token",
      });
    } else {
      next();
    }
  } catch (err) {
    logger.warn(`Authentication failed due to ${err}`);
    res.status(401).json(err);
  }
};

module.exports = {
  verifyJwtToken,
};

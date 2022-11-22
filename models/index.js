const mongoose = require("mongoose");
const dotenv = require("dotenv");

const logger = require("../utils/logger");

dotenv.config();
mongoose.set("debug", true);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    logger.info("DB connected");
  })
  .catch((err) => {
    logger.fatal(`DB connection failed due to ${err}`);
  });

mongoose.Promise = Promise;
module.exports.User = require("./user");
module.exports.Portfolio = require("./portfolio");
module.exports.Trade = require("./trade");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const logger = require("./utils/logger");
const tradeRoutes = require("./routes/tradeRoutes");
const userRoutes = require("./routes/userRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const dbRoutes = require("./routes/dbRoutes");

dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/trade", tradeRoutes);
app.use("/portfolio", portfolioRoutes);
app.use("/db", dbRoutes);

app.listen(process.env.PORT || 3000, () => {
  logger.info("Server started");
});

const express = require("express");
const router = express.Router();

const db = require("../../models");

router.delete("/clear", async (req, res) => {
  try {
    await db.Portfolio.deleteMany({});
    await db.Trade.deleteMany({});
    await db.User.deleteMany({});
    res.status(200).json({
      message: "db cleared successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: `db clear failed due to ${err}`,
    });
  }
});

module.exports = router;

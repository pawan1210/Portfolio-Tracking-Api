const db = require("../../models");
const logger = require("../../utils/logger");

function getUserByEmail(email) {
  try {
    const user = db.User.findOne({ email });
    return user;
  } catch (err) {
    logger.warn(`User fetch failed due to ${err}`);
    return null;
  }
}

function getUserById(userId) {
  try {
    const user = db.User.findById(userId);
    return user;
  } catch (err) {
    logger.warn(`User fetch failed due to ${err}`);
    return null;
  }
}

module.exports = {
  getUserByEmail,
  getUserById,
};

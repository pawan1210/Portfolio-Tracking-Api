const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const db = require("../../models");
const logger = require("../../utils/logger");
const userDao = require("./userDao");

const jwtSecretKey = process.env.JWT_SECRET_KEY;

async function generateJwtToken(userData) {
  const user = await userDao.getUserByEmail(userData.email);
  if (user) {
    const data = {
      email: user.email,
    };
    const token = jwt.sign(data, jwtSecretKey);
    return { token, user };
  } else {
    return null;
  }
}

async function registerUser(req) {
  try {
    const newUser = await db.User.create(req.body);
    return {
      status: 201,
      user: newUser,
      message: "User created successfully",
    };
  } catch (err) {
    logger.warn(`${req.route.path} - User creation failed due to ${err}`);
    return {
      status: 400,
      message: `User creation failed due to ${err}`,
    };
  }
}

async function loginUser(req) {
  const { token, user } = await generateJwtToken(req.body);
  if (token) {
    return {
      status: 200,
      token,
      user,
    };
  } else {
    logger.warn(`${req.route.path} - Login failed`);
    return {
      status: 400,
      message: "Invalid user credentials",
    };
  }
}

module.exports = {
  loginUser,
  registerUser,
};

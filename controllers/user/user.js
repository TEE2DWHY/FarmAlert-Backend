const User = require("../../models/User");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

// Get all users
const allUsers = asyncWrapper(async (req, res) => {
  const user = await User.find();
  res.status(StatusCodes.OK).json({
    message: {
      allUsers: user,
    },
  });
});

// Get a Specific User
const getUser = asyncWrapper(async (req, res) => {
  const { id } = req.user;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid Token.",
    });
  }
  res.status(StatusCodes.OK).json({
    message: {
      user: user,
    },
  });
});

module.exports = { allUsers, getUser };

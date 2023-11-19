const User = require("../../models/User");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

// Get all users
const allUsers = asyncWrapper(async (req, res) => {
  const users = await User.find();
  res.status(StatusCodes.OK).json({
    message: {
      allUsers: users.map((user) => ({
        name: user.fullName,
        email: user.email,
        isVerified: user.isEmailVerified,
        Id: user.Id,
      })),
    },
  });
});

// Get a Specific User
const getUser = asyncWrapper(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please Provide Token.",
    });
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const { userId } = decodedToken;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid Token.",
    });
  }
  res.status(StatusCodes.OK).json({
    message: {
      user: {
        name: user.fullName,
        email: user.email,
        isVerified: user.isEmailVerified,
        Id: user.Id,
      },
    },
  });
});

// Delete User
const deleteUser = asyncWrapper(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please Provide Token.",
    });
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const { userId, email } = decodedToken;
  console.log(decodedToken);
  const user = await User.findOneAndDelete({ _id: userId });
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid Token.",
    });
  }
  res.status(StatusCodes.OK).json({
    message: `Account for ${email} is Deleted.`,
  });
});

module.exports = { allUsers, getUser, deleteUser };

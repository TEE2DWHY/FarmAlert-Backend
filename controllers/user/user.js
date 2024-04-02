const User = require("../../models/User");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Function to create consistent response data
const createResponseData = (payload, hasErrors, message) => {
  return {
    payload,
    hasErrors,
    message,
  };
};

// Get all users
const allUsers = asyncWrapper(async (req, res) => {
  const users = await User.find();
  const sanitizedUsers = users.map((user) => {
    const { password, ...userData } = user.toObject();
    return userData;
  });
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        allUsers: sanitizedUsers,
      },
      false,
      "Retrieved all users successfully."
    )
  );
});

// Get a Specific User
const getUser = asyncWrapper(async (req, res) => {
  const { id } = req.currentUser;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "User Not Found."));
  }
  const { password, ...userData } = user.toObject();
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        user: userData,
      },
      false,
      "Retrieved user successfully."
    )
  );
});

// Update a User
const updateUser = asyncWrapper(async (req, res) => {
  const { id } = req.currentUser;
  const data = { ...req.body };
  if (Object.keys(data).length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide Data."));
  }
  const existingUser = await User.findOne({ _id: id });
  if (!existingUser) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(createResponseData(null, true, `User with Id: ${id} not found.`));
  }
  // Update only non-null fields from req.body
  Object.keys(data).forEach((key) => {
    if (data[key] !== null) {
      existingUser[key] = data[key];
    }
  });
  const updatedUser = await existingUser.save();
  const { password, ...updatedUserData } = updatedUser.toObject();
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        user: updatedUserData,
      },
      false,
      `User with Id: ${id} is Successfully Updated.`
    )
  );
});

// Delete a Specific User
const deleteUser = asyncWrapper(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide Token."));
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const { userId, email } = decodedToken;
  const user = await User.findOneAndDelete({ _id: userId });
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Invalid Token."));
  }
  res
    .status(StatusCodes.OK)
    .json(createResponseData(null, false, `Account for ${email} is Deleted.`));
});

const changePassword = asyncWrapper(async (req, res) => {
  const { id } = req.currentUser;
  const { oldPassword, newPassword } = req.body;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "User Does Not Exist."));
  }
  const passwordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!passwordMatch) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Incorrect Old Password."));
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json(createResponseData(null, false, "Password Update is Successful"));
});

module.exports = { allUsers, getUser, updateUser, deleteUser, changePassword };

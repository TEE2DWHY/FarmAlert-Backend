const User = require("../../models/User");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

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
  const { token } = req.query;
  if (!token) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide Token."));
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const { userId } = decodedToken;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Invalid Token."));
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
  const { userId } = req.params;
  const data = { ...req.body };
  if (!userId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide UserId."));
  }
  if (Object.keys(data).length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide Data."));
  }
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { $set: data },
    { new: true }
  );
  const { password, ...updatedUserData } = updatedUser.toObject();
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        user: updatedUserData,
      },
      false,
      `User with Id: ${userId} is Successfully Updated.`
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

module.exports = { allUsers, getUser, updateUser, deleteUser };

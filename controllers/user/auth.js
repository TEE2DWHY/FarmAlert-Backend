const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
const {
  sendEmail,
  verifyEmailMessage,
  resetPasswordMessage,
} = require("../../utils/email");

// Function to create consistent response data
const createResponseData = (payload, hasError, message) => {
  return {
    payload,
    hasError,
    message,
  };
};

// Register
const register = asyncWrapper(async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Password Mismatch."));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ ...req.body, password: hashedPassword });
  const verificationToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  await sendEmail({
    email: user.email,
    subject: "VERIFY YOUR EMAIL - CIMA APP",
    message: verifyEmailMessage(verificationToken, "user", user.fullName),
  });
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        name: user.fullName,
        verificationToken: verificationToken,
      },
      false,
      "User is Created Successfully."
    )
  );
});

// Verify email
const verifyEmail = asyncWrapper(async (req, res) => {
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
  if (user.isEmailVerified === true) {
    return res
      .status(StatusCodes.OK)
      .json(createResponseData(null, false, "Email is Already Verified."));
  }
  user.isEmailVerified = true;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json(createResponseData(null, false, "Email Verification is Successful."));
});

// Login
const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        createResponseData(null, true, "Please Provide Email and Password.")
      );
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "User does not Exist."));
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Incorrect Password."));
  }
  if (user.isEmailVerified === false) {
    const verificationToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFETIME,
      }
    );
    await sendEmail({
      email: user.email,
      subject: "VERIFY YOUR EMAIL - CIMA APP",
      message: verifyEmailMessage(verificationToken, "user", user.fullName),
    });
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        createResponseData(
          null,
          true,
          "A verification link has been sent. Please Verify Email."
        )
      );
  }
  const token = jwt.sign(
    { userId: user._id, name: user.fullName, email: email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        token: token,
      },
      false,
      "Login is Successful."
    )
  );
});

// Forgot password
const forgotPassword = asyncWrapper(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide Email."));
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "User does not Exist."));
  }
  const resetPasswordToken = jwt.sign(
    { userId: user._id, email: email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  await sendEmail({
    email: user.email,
    subject: "RESET YOUR PASSWORD - CIMA APP",
    message: resetPasswordMessage(resetPasswordToken, "user"),
  });
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        resetPasswordToken: resetPasswordToken,
      },
      false,
      "Reset password email sent."
    )
  );
});

// Reset password
const resetPassword = asyncWrapper(async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Password Mismatch."));
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
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
  user.password = hashedPassword;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json(createResponseData(null, false, "Password Reset is Successful."));
});

module.exports = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
};

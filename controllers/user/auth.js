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

// Register
const register = asyncWrapper(async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Password Mismatch.",
    });
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
  res.status(StatusCodes.CREATED).json({
    name: user.fullName,
    message: `User is Created Successfully.`,
    verificationToken: verificationToken,
  });
});

// Verify email
const verifyEmail = asyncWrapper(async (req, res) => {
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
  if (user.isEmailVerified === true) {
    return res.status(StatusCodes.OK).json({
      message: "Email is Already Verified.",
    });
  }
  user.isEmailVerified = true;
  await user.save();
  res.status(StatusCodes.OK).json({
    message: "Email Verification is Successful.",
  });
});

// Login
const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please Provide Email and Password.",
    });
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "User does not Exist.",
    });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Incorrect Password",
    });
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
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "A verification link has been sent. Please Verify Email.",
    });
  }
  const token = jwt.sign(
    { userId: user._id, email: email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  res.status(StatusCodes.OK).json({
    message: "Login is Successful",
    token: token,
  });
});

// Forgot password
const forgotPassword = asyncWrapper(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please Provide Email.",
    });
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "User does not Exist",
    });
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
    message: resetPasswordMessage(resetPasswordToken),
  });
  res.status(StatusCodes.OK).json({
    message: "Reset password email sent",
    resetPasswordToken: resetPasswordToken,
  });
});

// Reset password
const resetPassword = asyncWrapper(async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Password Mismatch.",
    });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
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
  user.password = hashedPassword;
  await user.save();
  res.status(StatusCodes.OK).json({
    message: "Password Reset is Successful.",
  });
});

module.exports = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
};

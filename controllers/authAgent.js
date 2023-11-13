const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Agent = require("../models/Agent");
const asyncWrapper = require("../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
const {
  sendEmail,
  verifyEmailMessage,
  resetPasswordMessage,
} = require("../utils/email");

// Register
const register = asyncWrapper(async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Password Mismatch.",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const agent = await Agent.create({ ...req.body, password: hashedPassword });
  const verificationToken = jwt.sign(
    { userId: agent._id, email: agent.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  await sendEmail({
    email: agent.email,
    subject: "VERIFY YOUR EMAIL - CIMA APP",
    message: verifyEmailMessage(verificationToken, agent.fullName),
  });
  res.status(StatusCodes.CREATED).json({
    name: agent.fullName,
    msg: `User is Created Successfully.`,
    verificationToken: verificationToken,
  });
});

// Verify Email
const verifyEmail = asyncWrapper(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please Provide Token",
    });
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const { userId } = decodedToken;
  const agent = await Agent.findOne({ _id: userId });
  if (!agent) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Invalid Registration Token",
    });
  }
  if (agent.isEmailVerified === true) {
    return res.status(StatusCodes.OK).json({
      msg: `${agent.email} is Already Verified.`,
    });
  }
  agent.isEmailVerified = true;
  await agent.save();
  res.status(StatusCodes.OK).json({
    msg: "Email is now Verified.",
  });
});

// Login
const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide email and password.",
    });
  }
  const agent = await Agent.findOne({ email: email });
  if (!agent) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Incorrect Email or Password.",
    });
  }
  const passwordMatch = await bcrypt.compare(password, agent.password);
  if (!passwordMatch) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Incorrect Password.",
    });
  }
  if (agent.isEmailVerified === false) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Please Verify Email Before Login.",
    });
  }
  const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  res.status(StatusCodes.OK).json({
    msg: "Login is Successful.",
    token: token,
  });
});

// forgot password
const forgotPassword = asyncWrapper(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(StatusCodes.OK).json({
      msg: "Please Provide Email.",
    });
  }
  const agent = await Agent.findOne({ email: email });
  if (!agent) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "User does not exit.",
    });
  }
  const resetPasswordToken = jwt.sign({ email: email }, process.env.JWT_SECRET);
  await sendEmail({
    email: agent.email,
    subject: "EVOV- RESET PASSWORD",
    message: resetPasswordMessage(resetPasswordToken),
  });
  res.status(StatusCodes.OK).json({
    msg: "Reset password email sent",
    resetPasswordToken: resetPasswordToken,
  });
});

// reset password
const resetPassword = asyncWrapper(async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Password Mismatch.",
    });
  } else if (!newPassword || !confirmPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please Provide Password or Confirm Password",
    });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please Provide Token.",
    });
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const { email } = decodedToken;
  const agent = await Agent.findOne({ email: email });
  if (!agent) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "User not Found.",
    });
  }
  agent.password = hashedPassword;
  await agent.save();
  res.status(StatusCodes.OK).json({
    msg: "Password is Successfully Updated.",
  });
});

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
};

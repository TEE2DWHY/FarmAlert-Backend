const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Agent = require("../models/Agent");
const asyncWrapper = require("../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
const { sendEmail, verifyEmailMessage } = require("../utils/email");

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
    { email: agent.email },
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
  const email = decodedToken.email;
  const agent = await Agent.findOneAndUpdate(
    { email },
    { $set: { isEmailVerified: true } },
    { new: true }
  );
  if (!agent) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: "Invalid Registration Token",
    });
  } else if (agent.isEmailVerified === true) {
    return res.status(StatusCodes.OK).json({
      msg: `${agent.email} is Already Verified.`,
    });
  }
  res.status(StatusCodes.OK).json({
    msg: "Email is now Verified.",
  });
});

// Login
const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const agent = await Agent.findOne({ email: email });
  if (!agent) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Incorrect Email or Password.",
    });
  } else if (agent.isEmailVerified === false) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Please Verify Email Before Login.",
    });
  }
  const passwordMatch = await bcrypt.compare(password, agent.password);
  if (!passwordMatch) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Incorrect Password.",
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

module.exports = { register, login, verifyEmail };

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncWrapper = require("../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
const { sendEmail, verifyEmailMessage } = require("../utils/email");

const register = asyncWrapper(async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Password Mismatch.",
    });
  }
  const verificationToken = jwt.sign(
    { email: agent.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ ...req.body, password: hashedPassword });
  res.status(StatusCodes.CREATED).json({
    msg: "User created successfully.",
  });
  await sendEmail({
    email: user.email,
    subject: "VERIFY YOUR EMAIL - CIMA APP",
    message: verifyEmailMessage(verificationToken, user.fullName),
  });
  res.status(StatusCodes.CREATED).json({
    name: user.fullName,
    msg: `User is Created Successfully.`,
    verificationToken: verificationToken,
  });
});

const login = asyncWrapper(async (req, res) => {});

module.exports = { register, login };

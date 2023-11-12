const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Agent = require("../models/Agent");
const asyncWrapper = require("../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");

// Sign Up
const register = asyncWrapper(async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Password Mismatch.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const agent = await Agent.create({ ...req.body, password: hashedPassword });
    res.status(StatusCodes.CREATED).json({
      name: agent.fullName,
      msg: `User is Created Successfully.`,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: err.message,
    });
  }
});

// Login
const login = asyncWrapper(async (req, res) => {
  try {
    const { email, password } = req.body;
    const agent = await Agent.findOne({ email });
    if (!agent) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Invalid credentials. User not found.",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, agent.password);
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Invalid credentials. Incorrect password.",
      });
    }
    const token = jwt.sign({ userId: agent._id }, "your-secret-key", {
      expiresIn: "1h",
    });
    res.status(StatusCodes.OK).json({
      msg: "Login successful.",
      token: token,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: err.message,
    });
  }
});

module.exports = { register, login };

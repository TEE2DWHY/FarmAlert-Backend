const Agent = require("../../models/Agent");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

// Get all Agent
const allAgents = asyncWrapper(async (req, res) => {
  const agents = await Agent.find();
  res.status(StatusCodes.OK).json({
    message: {
      allAgents: agents.map((agent) => ({
        name: agent.fullName,
        email: agent.email,
        isVerified: agent.isEmailVerified,
        Id: agent.Id,
      })),
    },
  });
});

// Get a Specific Agent
const getAgent = asyncWrapper(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please Provide Token.",
    });
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const { userId } = decodedToken;
  const agent = await Agent.findOne({ _id: userId });
  if (!agent) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid Token.",
    });
  }
  res.status(StatusCodes.OK).json({
    message: {
      agent: {
        name: agent.fullName,
        email: agent.email,
        isVerified: agent.isEmailVerified,
        Id: agent.Id,
      },
    },
  });
});

// Delete a Specific Agent
const deleteAgent = asyncWrapper(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please Provide Token.",
    });
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const { userId, email } = decodedToken;
  const agent = await User.findOneAndDelete({ _id: userId });
  if (!agent) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid Token.",
    });
  }
  res.status(StatusCodes.OK).json({
    message: `Account for ${email} is Deleted.`,
  });
});

module.exports = { allAgents, getAgent, deleteAgent };

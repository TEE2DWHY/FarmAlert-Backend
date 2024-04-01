const Agent = require("../../models/Agent");
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

// Get all Agents
const allAgents = asyncWrapper(async (req, res) => {
  const agents = await Agent.find();
  const allAgents = agents.map((agent) => {
    const { password, ...agentData } = agent.toObject();
    return agentData;
  });
  res
    .status(StatusCodes.OK)
    .json(
      createResponseData(allAgents, false, "All agents retrieved successfully.")
    );
});

// Get a Specific Agent
const getAgent = asyncWrapper(async (req, res) => {
  const { id } = req.currentUser;
  const agent = await Agent.findOne({ _id: id });
  if (!agent) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Invalid token."));
  }
  const { password, ...agentData } = agent.toObject();
  res
    .status(StatusCodes.OK)
    .json(
      createResponseData(agentData, false, "Agent retrieved successfully.")
    );
});

// Update Agent
const updateAgent = asyncWrapper(async (req, res) => {
  const { agentId } = req.params;
  const data = { ...req.body };
  if (!agentId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please provide agent Id."));
  }
  if (Object.keys(data).length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "No update data provided."));
  }
  const agent = await Agent.findOneAndUpdate(
    { _id: agentId },
    { $set: data },
    { new: true }
  );
  if (!agent) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(
        createResponseData(null, true, `Agent with Id: ${agentId} not found.`)
      );
  }
  const { password, ...updatedAgentData } = agent.toObject();
  res
    .status(StatusCodes.OK)
    .json(
      createResponseData(
        updatedAgentData,
        false,
        `Agent with Id: ${agentId} updated successfully.`
      )
    );
});

// Delete a Specific Agent
const deleteAgent = asyncWrapper(async (req, res) => {
  const { id } = req.currentUser;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const agent = await Agent.findOneAndDelete({ _id: id });
  if (!agent) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Invalid token."));
  }
  res
    .status(StatusCodes.OK)
    .json(createResponseData("Account for  is deleted.", false, null));
});

const changePassword = asyncWrapper(async (req, res) => {
  const { id } = req.currentUser;
  const { oldPassword, newPassword } = req.body;
  const agent = await Agent.findOne({ _id: id });
  if (!agent) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Agent Does Not Exist."));
  }
  const passwordMatch = await bcrypt.compare(oldPassword, agent.password);
  if (!passwordMatch) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Incorrect Old Password."));
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  agent.password = hashedPassword;
  await agent.save();
  res
    .status(StatusCodes.OK)
    .json(createResponseData(null, false, "Password Update is Successful"));
});

module.exports = {
  allAgents,
  getAgent,
  updateAgent,
  deleteAgent,
  changePassword,
};

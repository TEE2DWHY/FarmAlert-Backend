const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const authorization = async (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken || !authToken.startsWith("Bearer")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Unauthorized User.",
    });
  }
  const token = authToken.split(" ")[1];
  const agent = jwt.verify(token, process.env.JWT_SECRET);
  if (!agent) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid Token",
    });
  }
  const { agentId, email } = agent;
  req.agent = {
    id: agentId,
    email: email,
  };
  next();
};

module.exports = authorization;

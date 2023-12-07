const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const asyncWrapper = require("./asyncWrapper");

const authorization = asyncWrapper(async (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken || !authToken.startsWith("Bearer")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Unauthorized User.",
    });
  }
  const token = authToken.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid Token",
    });
  }
  const { userId, name } = decodedToken;
  req.currentUser = {
    id: userId,
    name: name,
  };
  next();
});

module.exports = authorization;

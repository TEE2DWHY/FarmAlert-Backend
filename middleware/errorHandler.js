const { StatusCodes } = require("http-status-codes");
const { TokenExpiredError, JsonWebTokenError } = require("jsonwebtoken");

const errorHandler = async (err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: err.message,
    });
  }
  if (err.code === 11000) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `${Object.keys(err.keyValue)} is taken already.`,
    });
  }
  if (err.name === "CastError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `${Object.keys(err.value)} is not found in database.`,
    });
  }
  if (err instanceof TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Token has expired.",
    });
  }
  if (err instanceof JsonWebTokenError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid token. Please provide a valid token.",
    });
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: err.message,
  });
  next();
};

module.exports = errorHandler;

const { StatusCodes } = require("http-status-codes");

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
      message: `${err.value} is not found in database.`,
    });
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: err.message,
  });
  next();
};

module.exports = errorHandler;

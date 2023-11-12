const { StatusCodes } = require("http-status-codes");

const errorHandler = async (err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: `${Object.keys(err.keyValue)} is taken already`,
    });
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    msg: err.message,
  });
  next();
};

module.exports = errorHandler;

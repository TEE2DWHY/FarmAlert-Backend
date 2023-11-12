const { StatusCodes } = require("http-status-codes");

const errorHandler = async (req, res) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    msg: "An error occurred.",
  });
};

module.exports = errorHandler;

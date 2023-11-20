const lga = require("../data/lga.json");
const asyncWrapper = require("../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");

const getAddress = asyncWrapper(async (req, res) => {
  res.status(StatusCodes.OK).json({
    message: lga,
  });
});

module.exports = getAddress;

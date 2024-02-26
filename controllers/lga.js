const lga = require("../data/lga.json");
const asyncWrapper = require("../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");

// Function to create consistent response data
const createResponseData = (payload, hasErrors, message) => {
  return {
    payload,
    hasErrors,
    message,
  };
};

const getAddress = asyncWrapper(async (req, res) => {
  res
    .status(StatusCodes.OK)
    .json(
      createResponseData(lga, false, "Retrieved address data successfully.")
    );
});

module.exports = getAddress;

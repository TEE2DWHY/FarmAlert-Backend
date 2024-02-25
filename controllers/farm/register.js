const Farm = require("../../models/Farm");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");

// Function to create consistent response data
const createResponseData = (payload, hasError, message) => {
  return {
    payload,
    hasError,
    message,
  };
};

// create new farm
const createFarm = asyncWrapper(async (req, res) => {
  const { id, name } = req.currentUser;
  const farm = await Farm.create({
    ...req.body,
    createdBy: id,
  });
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        farm: farm,
        registrarName: {
          agentId: id,
          fullName: name,
        },
      },
      false,
      "New Farm Added successfully."
    )
  );
});

module.exports = createFarm;

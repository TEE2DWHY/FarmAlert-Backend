const asyncWrapper = require("../../middleware/asyncWrapper");
const Sales = require("../../models/Sales");
const { StatusCodes } = require("http-status-codes");

// Register
const registerSales = asyncWrapper(async (req, res) => {
  const newRecord = await Sales.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({
    message: newRecord,
  });
});

module.exports = registerSales;

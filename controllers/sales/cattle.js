const asyncWrapper = require("../../middleware/asyncWrapper");
const Sales = require("../../models/Sales");
const { StatusCodes } = require("http-status-codes");

// Register
const registerSales = asyncWrapper(async (req, res) => {
  const { id, name } = req.currentUser;
  const newRecord = await Sales.create({
    ...req.body,
    createdBy: {
      _id: id,
    },
  });
  res.status(StatusCodes.CREATED).json({
    message: newRecord,
    registrarName: {
      fullName: name,
    },
  });
});

module.exports = registerSales;

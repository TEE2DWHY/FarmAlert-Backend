const asyncWrapper = require("../../middleware/asyncWrapper");
const Sales = require("../../models/Sales");
const { StatusCodes } = require("http-status-codes");

// Register Sales
const registerSales = asyncWrapper(async (req, res) => {
  const data = { ...req.body };
  if (Object.keys(data).length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Form Fields Cannot Be Empty.",
    });
  }
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

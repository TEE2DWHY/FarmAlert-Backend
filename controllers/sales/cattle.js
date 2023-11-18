const mongoose = require("mongoose");
const asyncWrapper = require("../../middleware/asyncWrapper");
const Sales = require("../../models/Sales");
const { StatusCodes } = require("http-status-codes");

// Register
const register = asyncWrapper(async (req, res) => {
  const newRecord = await Sales.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({
    message: "New Sales Recorded Added.",
    record: newRecord,
  });
});

module.exports = register;

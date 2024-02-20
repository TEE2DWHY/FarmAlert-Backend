const asyncWrapper = require("../../middleware/asyncWrapper");
const Sales = require("../../models/Sales");
const { StatusCodes } = require("http-status-codes");

// Function to create consistent response data
const createResponseData = (payload, hasError, message) => {
  return {
    payload,
    hasError,
    message,
  };
};

// Register Sales
const registerSales = asyncWrapper(async (req, res) => {
  const data = { ...req.body };
  if (Object.keys(data).length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Form Fields Cannot Be Empty."));
  }
  const { id, name } = req.currentUser;
  const newRecord = await Sales.create({
    ...req.body,
    createdBy: {
      _id: id,
    },
  });
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        newRecord: newRecord,
        registrarName: {
          fullName: name,
        },
      },
      false,
      "Sales Record Created Successfully."
    )
  );
});

// Get Sales
const getAllSales = asyncWrapper(async (req, res) => {
  const sales = await Sales.find();
  if (sales.length === 0) {
    return res
      .status(StatusCodes.OK)
      .json(
        createResponseData(null, false, "No Sales Record has been Uploaded.")
      );
  }
  return res.status(StatusCodes.OK).json(
    createResponseData(
      {
        allSales: sales,
      },
      false,
      "All Sales Records Found."
    )
  );
});

// Update Sale Record
const updateSale = asyncWrapper(async (req, res) => {
  const { saleId } = req.params;
  if (!saleId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide SaleId."));
  }
  const data = { ...req.body };
  if (Object.keys(data).length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide Data."));
  }
  const updatedSale = await Sales.findOneAndUpdate(
    { Id: saleId },
    { $set: data },
    { new: true }
  );
  if (!updatedSale) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        createResponseData(null, true, `No Sales With ${saleId} is Found.`)
      );
  }
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        updatedSale: updatedSale,
      },
      false,
      `Sale with Id: ${saleId} has been Updated.`
    )
  );
});

// Delete Sale Record
const deleteSale = asyncWrapper(async (req, res) => {
  const { saleId } = req.params;
  if (!saleId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide SalesId."));
  }
  const sale = await Sales.findOneAndDelete({ Id: saleId });
  if (!sale) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Invalid Sales Id."));
  }
  res
    .status(StatusCodes.OK)
    .json(
      createResponseData(
        null,
        false,
        `Sales with Id: ${saleId} has been deleted.`
      )
    );
});

module.exports = {
  registerSales,
  getAllSales,
  updateSale,
  deleteSale,
};

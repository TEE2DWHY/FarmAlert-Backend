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

// Get Sales
const getAllSales = asyncWrapper(async (req, res) => {
  const sales = await Sales.find();
  if (sales.length === 0) {
    return res.status(StatusCodes.OK).json({
      message: "No Sales Record has been Uploaded.",
    });
  }
  return res.status(StatusCodes.OK).json({
    allSales: sales,
  });
});

// Get Specific Sale
// const getSale = asyncWrapper(async (req, res) => {
//   const { saleId } = req.params;
//   if (!saleId) {
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       message: "Please Provide SaleId.",
//     });
//   }
//   const sale = await Sales.findOne({ Id: saleId });
//   if (!sale) {
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       message: "Invalid Sale Id.",
//     });
//   }
//   if (sale.length === 0) {
//     return res.status(StatusCodes.OK).json({
//       message: "You have not added any Sale Transaction",
//     });
//   }
//   res.status(StatusCodes.OK).json({
//     message: sale,
//   });
// });

// Update Sale Record
const updateSale = asyncWrapper(async (req, res) => {
  const { saleId } = req.params;
  if (!saleId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please Provide SaleId.",
    });
  }
  const data = { ...req.body };
  if (Object.keys(data).length === 0) {
    return res.status(StatusCodes.OK).json({
      message: "Please Provide Data.",
    });
  }
  const updatedSale = await Sales.findOneAndUpdate(
    { Id: saleId },
    { $set: data },
    { new: true }
  );
  if (!updatedSale) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `No Sales With ${saleId} is Found.`,
    });
  }
  res.status(StatusCodes.OK).json({
    message: `Sale with Id: ${saleId} has been Updated`,
    updatedSale: updatedSale,
  });
});

// Delete Sale Record
const deleteSale = asyncWrapper(async (req, res) => {
  const { saleId } = req.params;
  if (!saleId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please Provide SalesId.",
    });
  }
  const sale = await Sales.findOneAndDelete({ Id: saleId });
  if (!sale) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid Sales Id.",
    });
  }
  res.status(StatusCodes.OK).json({
    message: `Sales with Id: ${saleId} has been deleted.`,
  });
});

module.exports = {
  registerSales,
  getAllSales,
  // getSale,
  updateSale,
  deleteSale,
};

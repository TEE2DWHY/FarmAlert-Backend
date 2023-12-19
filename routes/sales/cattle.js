const appRouter = require("../../utils/appRouter");
const {
  registerSales,
  getAllSales,
  // getSale,
  updateSale,
  deleteSale,
} = require("../../controllers/sales/cattle");

appRouter.post("/register-sales", registerSales);
appRouter.get("/all-sales", getAllSales);
// appRouter.get("/:saleId", getSale);
appRouter.put("/:saleId", updateSale);
appRouter.delete("/:saleId", deleteSale);

module.exports = appRouter;

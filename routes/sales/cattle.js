const appRouter = require("../../utils/appRouter");
const {
  registerSales,
  getAllSales,
  updateSale,
  deleteSale,
  getSale,
} = require("../../controllers/sales/cattle");

appRouter.post("/register-sales", registerSales);
appRouter.get("/all-sales", getAllSales);
appRouter.get("/:cattleId", getSale);
appRouter.put("/:saleId", updateSale);
appRouter.delete("/:saleId", deleteSale);

module.exports = appRouter;

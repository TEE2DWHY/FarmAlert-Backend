const registerSales = require("../../controllers/sales/cattle");
const appRouter = require("../../utils/appRouter");

appRouter.post("/register-sales", registerSales);

module.exports = appRouter;

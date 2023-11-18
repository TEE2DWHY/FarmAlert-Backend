const register = require("../../controllers/sales/cattle");
const appRouter = require("../../utils/appRouter");

appRouter.post("/register", register);

module.exports = appRouter;

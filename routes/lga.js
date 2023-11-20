const appRouter = require("../utils/appRouter");
const getAddress = require("../controllers/lga");

appRouter.get("/address", getAddress);

module.exports = appRouter;

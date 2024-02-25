const appRouter = require("../../utils/appRouter");
const register = require("../../controllers/farm/register");

appRouter.post("/farm", register);

module.exports = appRouter;

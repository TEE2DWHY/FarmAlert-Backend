const appRouter = require("../../utils/appRouter");
const register = require("../../controllers/profiling/cattle");

appRouter.post("/register", register);

module.exports = appRouter;

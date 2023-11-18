const appRouter = require("../../utils/appRouter");
const { getUser } = require("../../controllers/user/user");

appRouter.get("/user", getUser);

module.exports = appRouter;

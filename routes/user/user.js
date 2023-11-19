const appRouter = require("../../utils/appRouter");
const { getUser, allUsers } = require("../../controllers/user/user");

appRouter.get("/user", getUser);
appRouter.get("/all-user", allUsers);

module.exports = appRouter;

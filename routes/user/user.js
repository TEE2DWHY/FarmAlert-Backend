const appRouter = require("../../utils/appRouter");
const {
  getUser,
  allUsers,
  deleteUser,
} = require("../../controllers/user/user");

appRouter.get("/user", getUser);
appRouter.get("/all-user", allUsers);
appRouter.put("/update/:userId");
appRouter.delete("/user", deleteUser);

module.exports = appRouter;

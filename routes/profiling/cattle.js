const appRouter = require("../../utils/appRouter");
const {
  register,
  getCattle,
  allCattle,
} = require("../../controllers/profiling/cattle");

appRouter.post("/register", register);
appRouter.get("/all-cattle", allCattle);
appRouter.get("/get-cattle", getCattle);

module.exports = appRouter;

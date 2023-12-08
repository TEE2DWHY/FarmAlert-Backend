const appRouter = require("../../utils/appRouter");
const {
  registerCattle,
  getCattle,
  allCattle,
  allUserCattle,
  updateCattle,
} = require("../../controllers/profiling/cattle");

appRouter.post("/register-cattle", registerCattle);
appRouter.post("/update/:cattleId", updateCattle);
appRouter.get("/all-cattle", allCattle);
appRouter.get("/get-cattle/:cattleId", getCattle);
appRouter.get("/user-cattle", allUserCattle);

module.exports = appRouter;

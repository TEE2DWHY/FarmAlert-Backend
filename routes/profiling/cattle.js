const appRouter = require("../../utils/appRouter");
const {
  registerCattle,
  getCattle,
  allCattle,
} = require("../../controllers/profiling/cattle");

appRouter.post("/register-cattle", registerCattle);
appRouter.get("/all-cattle", allCattle);
appRouter.get("/get-cattle/:cattleId", getCattle);

module.exports = appRouter;

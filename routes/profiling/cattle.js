const appRouter = require("../../utils/appRouter");
const {
  registerCattle,
  getCattle,
  allCattle,
  allUserCattle,
  updateCattle,
  deleteCattle,
  verifyCattle,
} = require("../../controllers/profiling/cattle");

appRouter.post("/register-cattle", registerCattle);
appRouter.get("/all-cattle", allCattle);
appRouter.get("/get-cattle/:cattleId", getCattle);
appRouter.get("/verify-cattle/:cattleId", verifyCattle);
appRouter.get("/user-cattle", allUserCattle);
appRouter.post("/update/:cattleId", updateCattle);
appRouter.delete("/delete-cattle/:cattleId", deleteCattle);

module.exports = appRouter;

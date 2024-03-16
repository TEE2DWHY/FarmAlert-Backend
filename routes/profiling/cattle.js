const router = require("express").Router();
const {
  registerCattle,
  getCattle,
  allCattle,
  allUserCattle,
  updateCattle,
  deleteCattle,
  verifyCattle,
} = require("../../controllers/profiling/cattle");

router.post("/register-cattle", registerCattle);
router.get("/all-cattle", allCattle);
router.get("/get-cattle/:cattleId", getCattle);
router.get("/verify-cattle/:cattleId", verifyCattle);
router.get("/user-cattle", allUserCattle);
router.post("/update/:cattleId", updateCattle);
router.delete("/delete-cattle/:cattleId", deleteCattle);

module.exports = router;

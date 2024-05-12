const router = require("express").Router();
const {
  registerDog,
  getDog,
  allDog,
  allUserDog,
  updateDog,
  deleteDog,
  verifyDog,
} = require("../../controllers/profiling/dog");

router.post("/register-dog", registerDog);
router.get("/all-dog", allDog);
router.get("/get-dog/:dogId", getDog);
router.get("/verify-dog/:dogId", verifyDog);
router.get("/user-dog", allUserDog);
router.post("/update/:dogId", updateDog);
router.delete("/delete-dog/:dogId", deleteDog);

module.exports = router;

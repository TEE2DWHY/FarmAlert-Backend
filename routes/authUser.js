const router = require("express").Router();
const { register, login } = require("../controllers/authUser");

router.post("/user/register", register);
// router.get("/user/verify-email", verifyEmail);
router.post("/user/login", login);

module.exports = router;

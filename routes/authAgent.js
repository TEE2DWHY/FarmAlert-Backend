const router = require("express").Router();
const { register, login, verifyEmail } = require("../controllers/authAgent");

router.post("/register", register);
router.post("/login", login);
router.get("/verify-user", verifyEmail);

module.exports = router;

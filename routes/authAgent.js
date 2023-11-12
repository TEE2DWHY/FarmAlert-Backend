const router = require("express").Router();
const { register, login, verifyEmail } = require("../controllers/authAgent");

router.post("/register", register);
router.get("/verify-email", verifyEmail);
router.post("/login", login);

module.exports = router;

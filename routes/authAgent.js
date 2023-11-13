const router = require("express").Router();
const { register, login, verifyEmail } = require("../controllers/authAgent");

router.post("/agent/register", register);
router.get("/agent/verify-email", verifyEmail);
router.post("/agent/login", login);

module.exports = router;

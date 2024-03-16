const router = require("express").Router();

const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../../controllers/agent/auth");

router.post("/agent/register", register);
router.get("/agent/verify-email", verifyEmail);
router.post("/agent/login", login);
router.post("/agent/forgot-password", forgotPassword);
router.post("/agent/reset-password", resetPassword);

module.exports = router;

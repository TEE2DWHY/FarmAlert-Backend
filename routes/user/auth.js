const router = require("express").Router();
const {
  register,
  login,
  verifyEmail,
  resetPassword,
  forgotPassword,
} = require("../../controllers/user/auth");

router.post("/user/register", register);
router.get("/user/verify-email", verifyEmail);
router.post("/user/login", login);
router.post("/user/forgot-password", forgotPassword);
router.post("/user/reset-password", resetPassword);

module.exports = router;

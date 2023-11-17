const appRouter = require("../../utils/appRouter");
const {
  register,
  login,
  verifyEmail,
  resetPassword,
  forgotPassword,
} = require("../../controllers/auth/authUser");

appRouter.post("/user/register", register);
appRouter.get("/user/verify-email", verifyEmail);
appRouter.post("/user/login", login);
appRouter.post("/user/forgot-password", forgotPassword);
appRouter.post("/user/reset-password", resetPassword);

module.exports = appRouter;

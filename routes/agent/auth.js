const appRouter = require("../../utils/appRouter");

const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../../controllers/agent/auth");

appRouter.post("/agent/register", register);
appRouter.get("/agent/verify-email", verifyEmail);
appRouter.post("/agent/login", login);
appRouter.post("/agent/forgot-password", forgotPassword);
appRouter.post("/agent/reset-password", resetPassword);

module.exports = appRouter;

const authAgentRouter = require("../routes/agent/auth");
const authUserRouter = require("../routes/user/auth");
const cattleRouter = require("../routes/profiling/cattle");
const dogRouter = require("../routes/profiling/dog");
const salesRouterCattle = require("../routes/sales/cattle");
const salesRouterDog = require("../routes/sales/dog");
const healthRouterCattle = require("../routes/health/cattle");
const healthRouterDog = require("../routes/health/dog");
const userRouter = require("../routes/user/user");
const agentRouter = require("../routes/agent/agent");
const farmRouter = require("../routes/farm/farm");
const lgaRouter = require("../routes/lga");

module.exports = {
  authAgentRouter,
  authUserRouter,
  cattleRouter,
  dogRouter,
  salesRouterCattle,
  salesRouterDog,
  healthRouterCattle,
  healthRouterDog,
  userRouter,
  agentRouter,
  farmRouter,
  lgaRouter,
};

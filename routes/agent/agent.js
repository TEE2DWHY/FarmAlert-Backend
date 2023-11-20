const {
  getAgent,
  allAgents,
  deleteAgent,
} = require("../../controllers/agent/agent");
const appRouter = require("../../utils/appRouter");

appRouter.get("/agent", getAgent);
appRouter.get("/all-agents", allAgents);
appRouter.delete("/agent", deleteAgent);

module.exports = appRouter;

const {
  getAgent,
  allAgents,
  deleteAgent,
  updateAgent,
} = require("../../controllers/agent/agent");
const appRouter = require("../../utils/appRouter");

appRouter.get("/agent", getAgent);
appRouter.get("/all-agents", allAgents);
appRouter.delete("/agent", deleteAgent);
appRouter.put("/update/:agentId", updateAgent);

module.exports = appRouter;

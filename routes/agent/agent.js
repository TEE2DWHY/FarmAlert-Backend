const {
  getAgent,
  allAgents,
  deleteAgent,
  updateAgent,
} = require("../../controllers/agent/agent");
const authorization = require("../../middleware/authorization");
const router = require("express").Router();

router.get("/agent", authorization, getAgent);
router.get("/all-agents", allAgents);
router.delete("/agent", deleteAgent);
router.put("/update/:agentId", updateAgent);

module.exports = router;

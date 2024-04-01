const {
  getAgent,
  allAgents,
  deleteAgent,
  updateAgent,
  changePassword,
} = require("../../controllers/agent/agent");
const authorization = require("../../middleware/authorization");
const router = require("express").Router();

router.get("/agent", authorization, getAgent);
router.get("/all-agents", authorization, allAgents);
router.delete("/agent", authorization, deleteAgent);
router.put("/update/:agentId", authorization, updateAgent);
router.post("/agent/change-password", authorization, changePassword);

module.exports = router;

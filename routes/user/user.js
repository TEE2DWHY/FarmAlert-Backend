const router = require("express").Router();
const {
  getUser,
  allUsers,
  deleteUser,
  updateUser,
} = require("../../controllers/user/user");
const authorization = require("../../middleware/authorization");

router.get("/user", authorization, getUser);
router.get("/all-user", authorization, allUsers);
router.put("/update/:userId", authorization, updateUser);
router.delete("/user", authorization, deleteUser);

module.exports = router;

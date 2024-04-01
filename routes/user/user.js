const router = require("express").Router();
const {
  getUser,
  allUsers,
  deleteUser,
  updateUser,
  changePassword,
} = require("../../controllers/user/user");
const authorization = require("../../middleware/authorization");

router.get("/user", authorization, getUser);
router.get("/all-user", authorization, allUsers);
router.put("/update-user", authorization, updateUser);
router.post("/user/change-password", authorization, changePassword);
router.delete("/user", authorization, deleteUser);

module.exports = router;

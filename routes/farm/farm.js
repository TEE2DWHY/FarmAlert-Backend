const router = require("express").Router();
const register = require("../../controllers/farm/register");

router.post("/farm", register);

module.exports = router;

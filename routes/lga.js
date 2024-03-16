const router = require("express").Router();
const getAddress = require("../controllers/lga");

router.get("/address", getAddress);

module.exports = router;

const router = require("express").Router();
const {
  createProduct,
  getProduct,
} = require("../../controllers/products/product");

router.post("/create", createProduct);
router.post("/get-product/:id", getProduct);

module.exports = router;

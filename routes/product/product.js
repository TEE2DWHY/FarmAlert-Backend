const router = require("express").Router();
const {
  createProduct,
  getAllProducts,
} = require("../../controllers/product/product");

router.get("/get-all-products", getAllProducts);
router.post("/create", createProduct);

module.exports = router;

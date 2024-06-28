const router = require("express").Router();
const {
  createProduct,
  getAllProducts,
} = require("../../controllers/product/product");

router.get("/get-all-products", getAllProducts);
router.post("/create-order", createProduct);

module.exports = router;

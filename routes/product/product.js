const router = require("express").Router();
const {
  createProduct,
  getAllProducts,
  deleteProduct,
} = require("../../controllers/product/product");

router.get("/get-all-products", getAllProducts);
router.post("/create", createProduct);
router.delete("/delete/:productId", deleteProduct);

module.exports = router;

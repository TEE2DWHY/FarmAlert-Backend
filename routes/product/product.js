const router = require("express").Router();
const {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProductColors,
} = require("../../controllers/product/product");

router.get("/get-all-products", getAllProducts);
router.post("/create", createProduct);
router.delete("/delete/:productId", deleteProduct);
router.patch("/update-color/:productId", updateProductColors);

module.exports = router;

const router = require("express").Router();
const {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProductColors,
  getProductsByCategory,
  getProductByCategoryAndName,
} = require("../../controllers/product/product");

router.get("/get-all-products", getAllProducts);
router.get("/get-product-by-category", getProductsByCategory);
router.get("/get-product-by-category-and-name", getProductByCategoryAndName);
router.post("/create", createProduct);
router.delete("/delete/:productId", deleteProduct);
router.patch("/update-color/:productId", updateProductColors);

module.exports = router;

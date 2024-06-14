const router = require("express").Router();
const {
  createProduct,
  getProduct,
  createPayment,
  getTransactionStatus,
  updateTransactionStatus,
  getAllProducts,
} = require("../../controllers/products/product");

router.post("/create", createProduct);
router.get("/get-product/:id", getProduct);
router.get("/get-products", getAllProducts);
router.post("/create-payment", createPayment);
router.get("/transaction-status", getTransactionStatus);
router.patch("/update-transaction-status", updateTransactionStatus);

module.exports = router;

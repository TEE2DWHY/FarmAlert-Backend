const router = require("express").Router();
const {
  createOrder,
  getOrder,
  createPayment,
  getTransactionStatus,
  updateTransactionStatus,
  getAllOrders,
} = require("../../controllers/order/order");

// router.post("/create", createOrder);
router.get("/get-order/:id", getOrder);
router.get("/get-order", getAllOrders);
router.post("/create-order/:productId", createOrder);
router.post("/create-payment", createPayment);
router.get("/transaction-status/:reference", getTransactionStatus);
router.patch("/update-transaction-status", updateTransactionStatus);

module.exports = router;

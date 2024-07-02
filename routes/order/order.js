const router = require("express").Router();
const {
  createOrder,
  getOrder,
  getOrderStatus,
  // updateTransactionStatus,
  getAllOrders,
} = require("../../controllers/order/order");

router.get("/get-order/:id", getOrder);
router.get("/get-order", getAllOrders);
router.post("/create-order/:productId", createOrder);
router.get("/transaction-status/:orderId", getOrderStatus);
// router.patch("/update-transaction-status", updateTransactionStatus);

module.exports = router;

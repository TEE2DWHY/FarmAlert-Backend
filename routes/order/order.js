const router = require("express").Router();
const {
  createOrder,
  getOrder,
  getOrderStatus,
  getAllOrders,
  deleteAllOrders,
} = require("../../controllers/order/order");

router.get("/get-order/:orderId", getOrder);
router.get("/get-order", getAllOrders);
router.post("/create-order/:productId", createOrder);
router.get("/transaction-status/:orderId", getOrderStatus);
router.delete("/delete-all", deleteAllOrders);

module.exports = router;

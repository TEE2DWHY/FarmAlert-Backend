const router = require("express").Router();
const upload = require("../utils/multer");
const authorization = require("../middleware/authorization");

const authAgentRouter = require("../routes/agent/auth");
const authUserRouter = require("../routes/user/auth");
const cattleRouter = require("../routes/profiling/cattle");
const dogRouter = require("../routes/profiling/dog");
const salesRouterCattle = require("../routes/sales/cattle");
const salesRouterDog = require("../routes/sales/dog");
const healthRouterCattle = require("../routes/health/cattle");
const healthRouterDog = require("../routes/health/dog");
const userRouter = require("../routes/user/user");
const agentRouter = require("../routes/agent/agent");
const farmRouter = require("../routes/farm/farm");
const lgaRouter = require("../routes/lga");
const orderRouter = require("../routes/order/order");
const productRouter = require("../routes/product/product");

router.use("/auth", authAgentRouter);
router.use("/auth", authUserRouter);
router.use("/register", authorization, farmRouter);
router.use("/health", authorization, healthRouterCattle);
router.use("/health", authorization, healthRouterDog);
router.use(
  "/cattle",
  authorization,
  upload.single("cattleImage"),
  cattleRouter
);
router.use("/dog", authorization, upload.single("dogImage"), dogRouter);
router.use("/sales", authorization, upload.single("image"), salesRouterCattle);
router.use("/sales", authorization, upload.single("image"), salesRouterDog);
router.use("/order", authorization, orderRouter);
router.use("/product", authorization, upload.single("image"), productRouter);
router.use(userRouter, agentRouter, lgaRouter);

module.exports = router;

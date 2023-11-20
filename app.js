const express = require("express");
const app = express();
require("dotenv").config();
// Db connection
const connect = require("./db/connect");
// middleWares
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");
const upload = require("./utils/multer");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
// const authorization = require("./middleware/authorization");

// Router(s)
const authAgentRouter = require("./routes/agent/auth");
const authUserRouter = require("./routes/user/auth");
const cattleRouter = require("./routes/profiling/cattle");
const salesRouter = require("./routes/sales/cattle");
const userRouter = require("./routes/user/user");
const agentRouter = require("./routes/agent/agent");
const lgaRouter = require("./routes/lga");

// middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
);
app.use("/auth", authAgentRouter);
app.use("/auth", authUserRouter);
app.use(userRouter, agentRouter, lgaRouter);
app.use("/cattle", upload.single("image"), cattleRouter);
app.use("/sales", salesRouter);
app.use(express.static("./public"));
app.use(errorHandler);
app.use(notFound);

const PORT = 8000 || process.env.PORT;

const start = async () => {
  try {
    await connect(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();

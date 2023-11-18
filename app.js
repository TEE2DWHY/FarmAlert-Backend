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
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
// Router(s)
const authAgentRouter = require("./routes/auth/authAgent");
const authUserRouter = require("./routes/auth/authUser");
const cattleRouter = require("./routes/profiling/cattle");
const salesRouter = require("./routes/sales/cattle");

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
app.use("/cattle", cattleRouter);
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

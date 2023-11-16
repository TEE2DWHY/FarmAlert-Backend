const express = require("express");
const app = express();
require("dotenv").config();
const connect = require("./db/connect");
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");
const authAgentRouter = require("./routes/authAgent");
const authUserRouter = require("./routes/authUser");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

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

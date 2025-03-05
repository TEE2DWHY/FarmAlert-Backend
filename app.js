const express = require("express");
const app = express();
require("dotenv").config();
const connect = require("./db/connect");
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
const routerConfig = require("./routes/_config");

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(routerConfig);
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

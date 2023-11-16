const express = require("express");
const app = express();
require("dotenv").config();
const connect = require("./db/connect");
const authAgentRouter = require("./routes/authAgent");
const authUserRouter = require("./routes/authUser");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

// middleware
app.use(express.json());
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

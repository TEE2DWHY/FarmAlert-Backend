const express = require("express");
const app = express();
require("dotenv").config();
const connect = require("./db/connect");
const authRouter = require("./routes/authAgent");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

// middleware
app.use(express.json());
app.use("/api/v1/auth", authRouter);
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

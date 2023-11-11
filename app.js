const express = require("express");
const app = express();
require("dotenv").config();
const connect = require("./db/connect");
const authRouter = require("./routes/auth");

// middleware
app.use(express.json());
app.use("/api/v1/auth", authRouter);

const start = async () => {
  try {
    await connect(process.env.MONGO_URI);
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port 3000");
    });
  } catch (err) {
    console.log(err);
  }
};

start();

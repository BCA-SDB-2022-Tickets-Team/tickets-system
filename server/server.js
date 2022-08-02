require("dotenv").config();

const 
  express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  cors = require("cors"),
  PORT = process.env.PORT;
  CONNECT = process.env.CONNECT

  mongoose.connect(`${CONNECT}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection-error"));

app.listen(PORT, () => {
  try {
    console.log(`Server running on ${PORT}`);
  } catch (err) {
    console.log(`Server error: ${err}`);
  }
});

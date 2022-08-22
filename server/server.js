require("dotenv").config();
const 
  express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  db = mongoose.connection,
  cors = require("cors"),
  PORT = process.env.PORT;
  CONNECT = process.env.CONNECT
// start database connection setup
  mongoose.connect(`${CONNECT}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
db.on("error", console.error.bind(console, "connection-error"))
// end database connection setup
//import controllers: 
const userAuth = require('./controllers/auth'),
      ticket = require('./controllers/ticket'),
      customField = require('./controllers/customfields')
//cors and JSON middlewares
app.use(cors())
app.use(express.json())
// auth middleware for login, create, modify users
app.use('/api/user', userAuth)
app.use('/api/ticket', ticket)
app.use("/api/fields", customField)
//Hey! Listen!
app.listen(PORT, () => {
  try {
    console.log(`Server running on ${PORT}`);
  } catch (err) {
    console.log(`Server error: ${err}`);
  }
});

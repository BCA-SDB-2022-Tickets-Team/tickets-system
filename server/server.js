require("dotenv").config();
const 
  express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  cors = require("cors"),
  PORT = process.env.PORT;
  CONNECT = process.env.CONNECT
// start database connection setup
  mongoose.connect(`${CONNECT}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection-error"))
// end database connection setup
const userAuth = require('./controllers/auth')
const ticket = require('./controllers/ticket')
const customField = require('./controllers/customfields')
app.use(cors())
app.use(express.json())

// auth middleware for login, create, modify users
app.use('/api/user', userAuth)
app.use('/api/ticket', ticket)
app.use("/api/fields", customField)



app.listen(PORT, () => {
  try {
    console.log(`Server running on ${PORT}`);
  } catch (err) {
    console.log(`Server error: ${err}`);
  }
});
//

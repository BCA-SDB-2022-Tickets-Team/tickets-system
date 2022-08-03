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
db.on("error", console.error.bind(console, "connection-error"))

const asrAuth = require('./controllers/asr-auth')
const reqAuth = require('./controllers/req-auth')

app.use(cors())
app.use(express.json())

app.use('/api/asr', asrAuth)
app.use('/api/req', reqAuth)

app.listen(PORT, () => {
  try {
    console.log(`Server running on ${PORT}`);
  } catch (err) {
    console.log(`Server error: ${err}`);
  }
});

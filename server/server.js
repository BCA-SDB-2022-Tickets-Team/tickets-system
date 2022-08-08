require("dotenv").config();
const 
  express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  cors = require("cors"),
  PORT = process.env.PORT,
  CONNECT = process.env.CONNECT,
  ticketSchema = require('./models/ticket_schema')
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

app.use(cors())
app.use(express.json())

// auth middleware for login, create, modify users
app.use('/api/user', userAuth)
app.use('/api/ticket', ticket)

app.get('/test', async (req,res) => {
  const { field } = req.body
  let fieldObj = new Object
  // let testDoc = ticketSchema.makeModel().findById('62f14d02d932b38a97ef503e')
  // console.log(testDoc.schema)
  fieldObj[field.name] = {
    type: field.type,
    required: field.required
  }
  ticketSchema.updateSchema(fieldObj)
  res.status(200).json(ticketSchema)
})

app.listen(PORT, () => {
  try {
    console.log(`Server running on ${PORT}`);
  } catch (err) {
    console.log(`Server error: ${err}`);
  }
});
//

const mongoose = require('mongoose')

let idcounter = new mongoose.Schema({
      COUNT: Number
  })
  
module.exports = mongoose.model("Ticket ID Counter", idcounter)
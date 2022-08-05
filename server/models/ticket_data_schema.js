const mongoose = require('mongoose')

// schema for data object in ticket schema
// just makes the ticket schema a little shorter/easier to follow
const Data = new mongoose.Schema(
  {
    dataSensitivity: {
      type: String,
      required: true,
    },
    dataDescription: {
      type: String,
      required: true
    }, 
    dataRegulation: {
      type: String,
      required: true,
      default: 'none',
      enum: ['none', 'gxp', 'sox', 'gdpr']
    },
    phi: {
      type: Boolean,
      required: true,
      default: false
    },
  }
)

module.exports = Data
const mongoose = require('mongoose')

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
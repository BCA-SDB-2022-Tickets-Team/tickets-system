const mongoose = require('mongoose')

let CustomField = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  fieldType: {
    type: String,
    required: true,
    enum: [
      'string',
      'number',
      'boolean',
      'array',
      'date'
    ]
  },
  isRequired: {
    type: Boolean,
    required: false
  },
  defaultVal: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('Custom Fields', CustomField)
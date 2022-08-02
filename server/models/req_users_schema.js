const mongoose = require('mongoose')

const User = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      // enum: [''] //TODO: define: roles here, return error if role not selected
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [12, 'Password must be at least 12 characters long']
    },
    isManager: {
      type: Boolean,
      required: true,
      default: false
    },
    manager: ObjectId
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model("user", User)
const mongoose = require('mongoose')

const ReqUser = new mongoose.Schema(
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
      enum: [
             'hr', 
             'it', 
             'legal', 
             'manufacturing', 
             'marketing', 
             'ops', 
             'procurement'
            ]
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
    manager: {
      type: mongoose.ObjectId,
      required: false
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model("reqUser", ReqUser)
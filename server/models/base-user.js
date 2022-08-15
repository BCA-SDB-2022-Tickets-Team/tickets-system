const mongoose = require("mongoose");
// create schema for base user object
// BOTH req user and asr user have the following fields:
const baseUser = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [12, "Password must be at least 12 characters long"],
    },
  },
  {
    // set collection for all users
    // set timestamps for all users
    collection: "users",
    timestamps: true,
    // this allows us to quickly and easily tell whether a found user is req or asr
    // ? example: " { __type: "reqUser" } "
    discriminatorKey: "__type"
  }
);

const User = mongoose.model("User", baseUser);

// extends base user schema
// adds fields unique to req user
const reqUser = User.discriminator(
  "reqUser",
  new mongoose.Schema(
    {
      department: {
        type: String,
        required: true,
        enum: [
          "hr",
          "it",
          "legal",
          "manufacturing",
          "marketing",
          "ops",
          "procurement",
        ],
      },
      isManager: {
        type: Boolean,
        required: true,
        default: false,
      },
      manager: {
        type: mongoose.ObjectId,
        required: false,
      }
    }
  )
);

// extends base user schema
// adds fields unique to asr user
const asrUser = User.discriminator(
  "asrUser",
  new mongoose.Schema(
    {
      isAdmin: {
        type: Boolean,
        required: true,
        default: false,
      }
    }
  )
);
// create and search for all types of users using User schema
module.exports = {
    User,
    asrUser : mongoose.model("asrUser"),
    reqUser : mongoose.model("reqUser")
}
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/req_users_schema");
const SALT = process.env.SALT || 10;
/* jwt = require("jsonwebtoken"),
  SECRET_KEY = process.env.SECRET_KEY */

router
  .route("/create-user")
  .post(async (req, res, next) => {
    const { firstName, lastName, email, role, password } = req.body;
    try {
      if (
          !firstName || 
          !lastName || 
          !email ||
          !role || 
          !password
        ) {
        throw new Error("Insufficient data");
      } else {
        const newUser = new User({
          firstName,
          lastName,
          email,
          role,
          password: bcrypt.hashSync(password, parseInt(SALT))
        });
        req.body.isManager ? (newUser.isManager = true) : null;
      
        try {
          await newUser.save();
          res.status(201).json({
            status: "user created",
            newUser,
          });
        } catch (error) {
          const missingData = Object.keys(error.errors)
          throw new Error(`you are missing the following data: ${[...missingData]}`)
        }
    }
    } catch (err) {
      next(err);
    }
  })
  .put(async (req, res, next) => {
    const { email } = req.body;
    try {
      let userToModify = await User.findOne({ email: email });
      if (!userToModify) {
        throw new Error("no user with that email exists");
      } else {
        for (field in req.body) {
          if (field === "password") {
            userToModify[field] = bcrypt.hashSync(
              req.body[field],
              parseInt(SALT)
            );
          } else {
            userToModify[field] = req.body[field];
          }
        }
        try {
          await userToModify.save();
          res.status(202).json({
            status: "user updated",
            userToModify,
          });
        } catch (error) {
          const missingData = Object.keys(error.errors)
          throw new Error(`user could not be updated because: you are missing the following data: ${[...missingData]}`)
        }
      }
    } catch (err) {
      next(err);
    }
  });

router.use((err, req, res, next) => {
  res.status(500).json({
    status: err.message,
  });
});
module.exports = router;

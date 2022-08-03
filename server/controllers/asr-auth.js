const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/asr_users_schema");
const SALT = process.env.SALT || 10;
/* jwt = require("jsonwebtoken"),
  SECRET_KEY = process.env.SECRET_KEY */

router
  .route("/create-user")
  .post(async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    try {
      if (!firstName || !lastName || !email || !password) {
        throw new Error("Insufficient data");
      } else {
        const newUser = new User({
          firstName,
          lastName,
          email,
          password: bcrypt.hashSync(password, parseInt(SALT)),
        });
        req.body.isAdmin ? (newUser.isAdmin = true) : null;
      
      await newUser.save();
      res.status(201).json({
        status: "user created",
        newUser,
      });
    }
    } catch (err) {
      console.log(err);
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
        await userToModify.save();
        res.status(202).json({
          status: "user updated",
          userToModify,
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

router.use((err, req, res) => {
  res.status(500).json({
    status: err,
  });
});
module.exports = router;

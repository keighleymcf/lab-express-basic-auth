const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    return res.render("signup", { message: "you must enter a username" });
  }
  if (!password) {
    return res.render("signup", { message: "you must enter a password" });
  }
  User.findOne({ username }).then(found => {
    if (!found) {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      User.create({ username: username, password: hash }).then(
        res.redirect("/").catch(err => {
          next(err);
        })
      );
    } else {
      res.render("signup", { message: "this username is already taken" });
    }
  });
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username }).then(found => {
    if (!found) {
      return res.render("login", { message: "this user does not exist" });
    }
    if (bcrypt.compareSync(password, found.password)) {
      req.session.user = found;
      res.redirect("main");
    } else {
      res.render("login", { message: "invalid credentials" });
    }
  });
});

module.exports = router;

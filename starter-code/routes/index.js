const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  const user = req.session.user;
  res.render("index", { user: user });
});

const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      return res.redirect("/login", {
        message: "you must be logged in to view this page"
      });
    }
  };
};

router.get("/main", loginCheck(), (req, res, next) => {
  res.render("main");
});

router.get("/private", loginCheck(), (req, res, main) => {
  res.render("private");
});

module.exports = router;

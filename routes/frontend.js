const router = require("express").Router();
const express = require("express");
const { auth } = require("./jwtVerification");

// router.use(express.static(__dirname + "/resources"));
router.use(express.static("../frontend"));

router.get("/home", auth, express.static("../pages/home.html"));
// router.get("/login", async (req, res) => {
//   res.render("login");
// });

// router.get("/home", async (req, res) => {
//   res.render("home");
// });

// router.get("/logout", async (req, res) => {
//   res.render("logout");
// });

module.exports = router;

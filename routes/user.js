const router = require("express").Router();
const { auth } = require("./jwtVerification");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { ticketValidation } = require("../validation");

router.post("/update/scopes", auth, async (req, res) => {
  if (!req.user.scopes.includes("admin"))
    return res.status(403).send("Unauthorized");
  if (!req.body.data) return res.status(400).send("Missing params");
  const user = await User.updateOne(
    { _id: req.body._id },
    { scopes: req.body.data },
    (err, updated) => {
      if (err) return res.status(404).send("user not found");
      res.status(200).send(updated);
    }
  );
});

router.post("/update/password", auth, async (req, res) => {
  if (!req.user.scopes.includes("admin"))
    return res.status(403).send("Unauthorized");
  if (!req.body.data) return res.status(400).send("missing params");
  const hashedPassword = await bcrypt.hash(req.body.data, 10);

  const user = await User.updateOne(
    { _id: req.body._id },
    { password: hashedPassword },
    (err, updated) => {
      if (err) return res.status(404).send("user not found");
      res.status(200).send(updated);
    }
  );
});

router.post("/update/email", auth, async (req, res) => {
  if (!req.user.scopes.includes("admin"))
    return res.status(403).send("Unauthorized");
  if (!req.body.data) return res.status(400).send("missing params");
  const userexists = await User.findOne({ email: req.body.data });
  if (userexists) return res.status(400).send("Email address already exists");

  const user = await User.updateOne(
    { _id: req.body._id },
    { email: req.body.data },
    (err, updated) => {
      if (err) return res.status(404).send("user not found");
      res.status(200).send(updated);
    }
  );
});

router.post("/update/username", auth, async (req, res) => {
  if (!req.user.scopes.includes("admin"))
    return res.status(403).send("Unauthorized");
  if (!req.body.data) return res.status(400).send("missing params");
  const userexists = await User.findOne({ username: req.body.data });
  if (userexists) return res.status(400).send("Username already exists");

  const user = await User.updateOne(
    { _id: req.body._id },
    { username: req.body.data },
    (err, updated) => {
      if (err) return res.status(404).send("User not found");
      res.status(200).send(updated);
    }
  );
});

router.get("/current", auth, async (req, res) => {
  let currentUser = {
    name: req.user.name,
    email: req.user.email,
    username: req.user.username,
  };
  res.send(currentUser);
});

router.get("/search", auth, async (req, res) => {
  if (!req.user.scopes.includes("admin"))
    return res.status(403).send("Unauthorized");
  let usersearch = await User.find(
    { email: { $regex: `${req.query.email}` } },
    { password: 0, token: 0, date: 0 }
  );
  res.send(usersearch);
});

router.get("/find/agent", auth, async (req, res) => {
  if (!req.user.scopes.includes("agent"))
    return res.status(403).send("Unauthorized");

  let usersearch = await User.find(
    { scopes: { $regex: "agent" } },
    { password: 0, token: 0, date: 0, email: 0 }
  );
  res.send(usersearch);
});

module.exports = router;

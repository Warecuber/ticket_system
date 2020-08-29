const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");
const { auth, refreshAuth } = require("./jwtVerification");
// const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");

//create new user
router.post("/register", async (req, res) => {
  // Joi validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check to see if user is aready in DB

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists");

  const usernameExists = await User.findOne({ username: req.body.username });
  if (usernameExists) return res.status(400).send("Username already exists");

  // hash password!
  // const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// login user
router.post("/login", async (req, res) => {
  // Joi validation
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check to see if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password incorrect");
  // check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Email or password incorrect");

  // create and assign token
  const token = generateAccessToken({
    _id: user._id,
    email: user.email,
    username: user.username,
    name: user.name,
    scopes: user.scopes,
  });
  const refresh_token = generateRefreshToken({
    _id: user._id,
    email: user.email,
    username: user.username,
    name: user.name,
    scopes: user.scopes,
  });
  await User.updateOne(
    { email: req.body.email },
    { token: refresh_token },
    (err) => {
      if (err) return res.status(400).send("error");

      res.header("authtoken", `Bearer ${token}`).send({
        token: token,
        refresh_token: refresh_token,
        expires_in: "15m",
      });
    }
  );

  // res.send("Authenticated");
});

router.post("/validate", auth, (req, res) => {
  res.send({ status: 200, message: "Valid token" });
});

router.post("/logout", auth, async (req, res) => {
  await User.updateOne(
    { _id: req.user._id },
    { token: "" },
    (err, writeOpResult) => {
      if (err) return res.status(400).send("error");
      res.send("logged out");
    }
  );
  // res.send(user);
});

router.post("/refresh", refreshAuth, async (req, res) => {
  // make a variable with the refresh token from the request body
  const refreshToken = req.refresh_token;
  // if there is no refresh token, not authorized
  if (!refreshToken) return res.sendStatus(401);
  // if the refresh token isn't in the list of valid token, unathorized
  const user = await User.findOne({ email: req.user.email });
  if (user.token !== refreshToken) return res.sendStatus(403);
  // verify the token with jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    // if there's an error, return unathorized
    if (err) return res.sendStatus(403);
    // if it is valid, make a variable with the user information from the refresh token
    const accessToken = generateAccessToken({
      _id: user._id,
      email: user.email,
      username: user.username,
      name: user.name,
      scopes: user.scopes,
    });
    // return the new access token
    res.json({
      status: 200,
      message: "token refreshed",
      accessToken: accessToken,
    });
  });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
}
function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
}

module.exports = router;

const jwt = require("jsonwebtoken");
const express = require("express");
// const router = require("express").Router();
const { ref } = require("@hapi/joi");

let auth = (req, res, next) => {
  const token = req.header("authtoken");
  const refresh_token = req.header("refresh_token");
  if (!token) return res.status(401).send("Not authenticated");

  try {
    const rawToken = token.replace("Bearer ", "");
    const verified = jwt.verify(rawToken, process.env.ACCESS_TOKEN_SECRET);
    req.refresh_token = refresh_token;
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};

let refreshAuth = (req, res, next) => {
  // const refresh_token = req.header("refresh_token");
  const refresh_token = req.body.refresh_token;
  if (!refresh_token) return res.status(401).send("Not authenticated");

  try {
    const verified = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET
    );
    req.refresh_token = refresh_token;
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};

module.exports.auth = auth;
module.exports.refreshAuth = refreshAuth;

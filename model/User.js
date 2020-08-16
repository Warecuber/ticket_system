const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    max: 2048,
    min: 6,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  scopes: {
    type: Array,
    default: ["create"],
    required: false,
  },
  token: {
    type: String,
    default: "",
    required: false,
    max: 2048,
  },
});

module.exports = mongoose.model("User", userSchema);

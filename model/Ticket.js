const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  reporter: {
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
  category: {
    type: String,
    default: "Default",
    required: false,
    max: 255,
    min: 6,
  },
  sub_category: {
    type: String,
    default: "Default",
    required: false,
    max: 255,
    min: 6,
  },
  description: {
    type: String,
    required: true,
    max: 2024,
    min: 6,
  },
  subject: {
    type: String,
    required: true,
    max: 255,
    min: 1,
  },
  agent: {
    type: String,
    default: "unassigned",
    required: true,
    max: 255,
    min: 6,
  },
  ticket_id: {
    type: Number,
    required: false,
    min: 1,
    max: 20,
  },
  status: {
    type: String,
    default: "Open",
    required: false,
    max: 255,
    min: 1,
  },
  thread: {
    type: Array,
    default: [],
    required: false,
  },
  comments: {
    type: Array,
    default: [],
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  priority: {
    type: String,
    default: "Low",
    required: false,
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);

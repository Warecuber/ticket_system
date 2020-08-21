const router = require("express").Router();
const { auth } = require("./jwtVerification");
const Ticket = require("../model/Ticket");
const User = require("../model/User");
const { ticketValidation } = require("../validation");

router.get("/get", auth, async (req, res) => {
  const userPermissions = await User.findOne({ id: req.user.id });
  if (!userPermissions.scopes.includes("agent"))
    return res.status(403).send("Unauthorized");
  const openTickets = await Ticket.find({ status: "Open" });
  res.send(openTickets);
});

router.get("/get/query", auth, async (req, res) => {
  const userPermissions = await User.findOne({ id: req.user.id });
  if (!userPermissions.scopes.includes("agent"))
    return res.status(403).send("Unauthorized");
  const openTickets = await Ticket.find({ status: req.query.status });
  res.send(openTickets);
});

router.post("/new", auth, async (req, res) => {
  const userPermissions = await User.findOne({ id: req.user.id });
  if (!userPermissions.scopes.includes("create"))
    return res.status(403).send("Not authorized to create tickets");

  const tempTicket = {
    reporter: req.user.name,
    subject: req.body.subject,
    email: req.user.email,
    description: req.body.description,
  };

  const { error } = ticketValidation(tempTicket);
  if (error) return res.status(400).send(error.details[0].message);
  const ticket = new Ticket({
    reporter: req.user.name,
    subject: req.body.subject,
    email: req.user.email,
    description: req.body.description,
  });
  try {
    const savedTicket = await ticket.save();
    res.send(savedTicket);
  } catch (err) {
    res.status(400).send(err);
  }
  res.send(ticket);
});

module.exports = router;

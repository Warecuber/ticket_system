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
  let query =
    req.query.queryName === "status"
      ? { status: req.query.status }
      : { _id: req.query.id };
  const resTickets = await Ticket.find(query);
  res.send(resTickets);
});

router.post("/new", auth, async (req, res) => {
  const userPermissions = await User.findOne({ id: req.user.id });
  if (!userPermissions.scopes.includes("create"))
    return res.status(403).send("Not authorized to create tickets");
  const ticketNumber = await Ticket.countDocuments();

  const tempTicket = {
    reporter: req.user.name,
    subject: req.body.subject,
    email: req.user.email,
    description: req.body.description,
  };

  const { error } = ticketValidation(tempTicket);
  if (error) return res.status(400).send(error.details[0].message);
  const ticket = new Ticket({
    ticket_number: ticketNumber + 1,
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

router.patch("/update", auth, async (req, res) => {
  const userPermissions = await User.findOne({ id: req.user.id });
  if (!userPermissions.scopes.includes("agent"))
    return res.status(403).send("Unauthorized");
  let query = { _id: req.body.ticket };
  let newData = {
    agent: req.body.assignedTo,
    status: req.body.status,
    priority: req.body.priority,
    category: req.body.category,
    sub_category: req.body.subCategory,
  };
  const resTickets = await Ticket.updateOne(query, newData);
  // res.send(resTickets);
  if (resTickets.ok === 1) {
    res.send({ status: 200, update: "OK" });
  }
});

module.exports = router;

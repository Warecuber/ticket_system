require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const ticketRoute = require("./routes/tickets");
// const { auth } = require("./routes/jwtVerification");
// const frontendRoute = require("./routes/frontend");

// connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("connected to DB!");
});

//middlewares
app.use(express.static("frontend"));

app.use(express.json());
app.use("/login", express.static("frontend/login.html"));
app.use("/home", express.static("frontend/home.html"));
app.use("/logout", express.static("frontend/logout.html"));
// app.set("view engine", "ejs");

// endpoints

app.use("/user", userRoute);
app.use("/user/auth", authRoute);
app.use("/tickets", ticketRoute);

app.listen(3000, () => {
  console.log("Starting server...");
});

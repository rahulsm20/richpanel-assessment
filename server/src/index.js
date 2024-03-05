const cors = require("cors");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const authRoutes = require("./routes/users.js");
const app = express();
const {
  messagingWebhook,
  webhookMessageHandler,
  sendResponseMessage,
} = require("./lib/messages.js");
const chatRoutes = require("./routes/chat.js");

app.use(
  session({
    secret: process.env.SECRET || "",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(cors());

function ensureAuthenticated(req, res) {
  try {
    if (req.isAuthenticated()) {
      return req.user;
    }
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
}

app.listen(5000, () => console.log("Running on port 5000"));

try {
  mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to DB");
} catch {
  console.log("Failed to connect to DB");
}
app.use("/auth", authRoutes);
app.get("/check", ensureAuthenticated);
app.post("/messaging-webhook", webhookMessageHandler);
app.get("/messaging-webhook",messagingWebhook);
app.post("/send-message", sendResponseMessage);
app.use("/chat", chatRoutes);
app.use("/", (req, res) => {
  console.log("received: ", req.body);
  res.json("Home");
});

module.exports = app;

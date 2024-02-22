const cors = require("cors");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const { Strategy } = require("passport-facebook");
const db = require("./db/connect");
const mongoose = require("mongoose");
const authRoutes = require("./routes/users.js");
const { getLatestConversationMessage } = require("./controllers/messages.js");
const app = express();
const axios = require("axios");
const User = require("./models/user.model.js");
app.use(
  session({
    secret: process.env.SECRET || "",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(cors());
passport.use(
  new Strategy(
    {
      clientID: process.env.FB_APP_ID || "",
      clientSecret: process.env.FB_APP_SECRET || "",
      callbackURL: `${process.env.SERVER_URL}/auth/facebook/callback`,
      profileFields: ["id", "displayName"],
      passReqToCallback: true,
    },
    async (_req, accessToken, _refreshToken, profile, done) => {
      try {
        // Check if the user exists in the database
        let user = await User.findOne({ id: parseInt(profile.id) % 100 });

        if (!user) {
          // If the user does not exist, create a new user
          user = await User.create({
            id: parseInt(profile.id) % 100,
            name: profile.displayName,
            token: accessToken,
          });
        }

        // Pass the user profile to the done callback
        return done(null, profile);
      } catch (err) {
        console.log(err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/auth/facebook", passport.authenticate("facebook"));
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook"),
  (req, res) => {
    if (req.user) {
      res.redirect(
        `${process.env.CLIENT_URL}/fb-login?user_data=${encodeURIComponent(
          JSON.stringify(req.user._json)
        )}`
      );
    } else {
      res.redirect("/login");
    }
  }
);

// Define login and logout routes
app.get("/login", (req, res) => {
  res.send("Please log in with Facebook.");
});

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
  res.redirect("/");
});

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
  db.connect();
  mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to DB");
} catch {
  console.log("Failed to connect to DB");
}
app.use("/auth", authRoutes);
app.get("/check", ensureAuthenticated);

app.post("/messaging-webhook", async (req, res) => {
  try {
    let body = req.body;
    console.log("received:", body);
    if (body.object === "page") {
      body.entry.forEach(async (entry) => {
        let webhookEvent = entry.messaging[0];
        console.log(webhookEvent);
        let senderId = webhookEvent.sender.id;
        let messageText = webhookEvent.message.text;
        const user = await axios.get(
          `https://graph.facebook.com/${senderId}?fields=first_name,last_name,profile_pic&access_token=${process.env.FB_MESSAGING_TOKEN}`
        );
        const message = {
          sender: {
            senderId,
            ...user.data,
          },
          message: messageText,
        };
        return res.status(200).json(message);
      });
    }
  } catch (err) {
    console.log("error getting message: ", err);
    return res.status(400).json(err);
  }
});

app.get("/messaging-webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === "poopoo") {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

const sendResponseMessage = async (senderId, messageText) => {
  // const { senderId, messageText } = req.body;
  let messageData = {
    recipient: {
      id: senderId,
    },
    message: {
      text: messageText,
    },
  };

  await axios
    .post(
      `https://graph.facebook.com/v13.0/me/messages?access_token=${process.env.FB_MESSAGING_TOKEN}`,
      messageData
    )
    .then((response) => {
      console.log("Message sent successfully:", response.data);
      // return res.status(200).json("message sent");
    })
    .catch((error) => {
      console.error("Error sending message:", error.response.data);
    });
};

// app.post("/send-message", sendResponseMessage);
app.get("/messages", getLatestConversationMessage);
app.use("/", (req, res) => {
  console.log("received: ", req.body);
  res.json("Home");
});

module.exports = app;

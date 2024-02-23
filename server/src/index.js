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
const {
  createMessage,
  createOrUpdateConversation,
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
      // try {
      //   // let user = await User.findOne({ id: profile.id });

      //   // if (!user) {
      //   //   console.log(profile);
      //   //   // const newUser = await User.create({
      //   //   //   id: profile.id,
      //   //   //   name: profile.displayName,
      //   //   //   token: accessToken,
      //   //   // });
      //   //   // console.log("new: ", newUser);
      //   // }
      // } catch (err) {
      //   console.log(err);
      //   return done(err);
      // // } finally {
      return done(null, profile);
      // }
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
        let senderId = webhookEvent.sender.id;
        let messageText = webhookEvent.message.text;
        console.log(senderId, process.env.RECIPIENT_ID);
        let user = {};
        let message = {};
        if (senderId != process.env.RECIPIENT_ID) {
          user = await axios.get(
            `https://graph.facebook.com/${senderId}?fields=first_name,last_name,profile_pic&access_token=${process.env.FB_MESSAGING_TOKEN}`
          );
          message = {
            sender: {
              senderId,
              ...user.data,
            },
            message: messageText,
          };
        } else {
          const userData = { first_name: "", last_name: " ", profile_pic: " " };
          message = {
            sender: {
              senderId,
              ...userData,
            },
          };
        }
        const conversation = await createOrUpdateConversation(
          senderId,
          process.env.RECIPIENT_ID
        );
        console.log("conv:", conversation);
        await createMessage({
          senderId,
          conversation,
          messageText,
        });
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

const sendResponseMessage = async (req, res) => {
  try {
    const { receiverId, messageText } = req.body;
    let messageData = {
      recipient: {
        id: receiverId,
      },
      message: {
        text: messageText,
      },
    };

    const response = await axios.post(
      `https://graph.facebook.com/v13.0/me/messages?access_token=${process.env.FB_MESSAGING_TOKEN}`,
      messageData
    );
    return res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

app.post("/send-message", sendResponseMessage);
app.use("/chat", chatRoutes);
app.use("/", (req, res) => {
  console.log("received: ", req.body);
  res.json("Home");
});

module.exports = app;

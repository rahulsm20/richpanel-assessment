const express = require("express");
const {
  authenticateFBUser,
  signin,
  signup,
  verifyToken,
} = require("../controllers/users.js");
const router = express.Router();
const passport = require("passport");
const { Strategy } = require("passport-facebook");
require('dotenv').config()

// passport.js setup
passport.use(
    new Strategy(
      {
        clientID: process.env.FB_APP_ID || "",
        clientSecret: process.env.FB_APP_SECRET || "",
        callbackURL: `${process.env.SERVER_URL}/auth/facebook/callback`,
        profileFields: ["id", "displayName"],
        passReqToCallback: true,
      },
      async (_req, _accessToken, _refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );
  
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
    
  router.post("/login", signin);
  router.post("/signup", signup);
  router.post("/verify", verifyToken);
  router.get("/facebook/verify", authenticateFBUser);
  router.get("/facebook", passport.authenticate("facebook"));
  router.get(
    "/facebook/callback",
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
  
  router.get("/login", (req, res) => {
    res.send("Please log in with Facebook.");
  });
  
  router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
    res.redirect("/");
  });
  
module.exports = router;

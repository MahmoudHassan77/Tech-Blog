const express = require("express");
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
const session = require("express-session");
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
const passport = require("passport");
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
const OAuth2Strategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");

const router = express.Router();

router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

router.use(passport.initialize());
router.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECERT,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      passReqToCallback: true,
      scope: ["profile", "email"],
    },
    async (request, accessToken, refreshToken, profile, done) => {
      console.log(profile);
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            name: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
            profileImg: profile.photos[0].value,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
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

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  process.env.GOOGLE_REDIRECT_URI,
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/home",
    failureRedirect: "http://localhost:3000/login",
  })
);

module.exports = router;

//
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
// const { User } = require("../models");
// const dotenv = require("dotenv");
// dotenv.config();
//
// module.exports = () => {
//   console.log(
//     "GOOGLE_CLIENT_ID:",
//     process.env.GOOGLE_CLIENT_ID,
//     "Type:",
//     typeof process.env.GOOGLE_CLIENT_ID
//   );
//   console.log(
//     "GOOGLE_CLIENT_SECRET:",
//     process.env.GOOGLE_CLIENT_SECRET,  // 수정된 부분
//     "Type:",
//     typeof process.env.GOOGLE_CLIENT_SECRET
//   );
//   console.log(
//     "GOOGLE_CALLBACK_URL:",
//     process.env.GOOGLE_CALLBACK_URL,
//     "Type:",
//     typeof process.env.GOOGLE_CALLBACK_URL
//   );
//
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // 수정된 부분
//         callbackURL: process.env.GOOGLE_CALLBACK_URL,
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         try {
//           console.log(profile);
//           const exUser = await User.findOne({
//             where: { google_id: profile.id },
//           });
//           if (exUser) {
//             done(null, exUser);
//           } else {
//             const newUser = await User.create({
//               google_id: profile.id,
//               user_name: profile.displayName,
//               email: profile.emails[0].value,
//               is_active: 1,
//             });
//             done(null, newUser);
//           }
//         } catch (err) {
//           console.error(err);
//           done(err);
//         }
//       }
//     )
//   );
// };

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');
const dotenv = require('dotenv');
dotenv.config();

module.exports = () => {
  passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log("Google Profile:", profile); // 프로필 정보 로그 출력
      const exUser = await User.findOne({ where: { google_id: profile.id } });
      if (exUser) {
        return done(null, exUser);
      } else {
        const newUser = await User.create({
          google_id: profile.id,
          user_name: profile.displayName,
          email: profile.emails[0].value,
        });
        return done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }
));
};



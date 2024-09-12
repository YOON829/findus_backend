// // const passport = require("passport");
// // const GoogleStrategy = require("passport-google-oauth20").Strategy; // Google OAuth 2.0 전략
// //
// // const User = require("../models/user");
// //
// // module.exports = () => {
// //   // Google OAuth 설정: 사용자가 Google로 로그인할 수 있도록 설정
// //   passport.use(
// //     new GoogleStrategy(
// //       {
// //         clientID: process.env.GOOGLE_CLIENT_ID, // Google 클라이언트 ID
// //         clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google 클라이언트 비밀키
// //         callbackURL: "/auth/callback", // 인증 후 리디렉션될 URL
// //       },
// //       async (accessToken, refreshToken, profile, done) => {
// //         try {
// //           let user = await User.findOne({ where: { googleId: profile.id } }); // 기존 사용자 검색
// //           if (!user) {
// //             user = await User.create({
// //               googleId: profile.id,
// //               token: accessToken,
// //             }); // 신규 사용자 생성
// //           }
// //           const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
// //             expiresIn: "1h",
// //           }); // JWT 토큰 생성
// //           return done(null, { user, token }); // 사용자 정보와 토큰을 반환
// //         } catch (error) {
// //           return done(error, null); // 오류 발생 시 처리
// //         }
// //       }
// //     )
// //   );
// // };
//
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
//     "GOOGLE_SECRET_KEY:",
//     process.env.GOOGLE_SECRET_KEY,
//     "Type:",
//     typeof process.env.GOOGLE_SECRET_KEY
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
//         clientSecret: process.env.GOOGLE_SECRET_KEY,
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
//               // email: profile._json?.email,
//               // nick: profile.displayName,
//               // snsId: profile.id,
//               // provider: "google",
//               // avatar: profile._json?.picture,
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
//
//


const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { User } = require("../models");
const dotenv = require("dotenv");
dotenv.config();

module.exports = () => {
  console.log(
    "GOOGLE_CLIENT_ID:",
    process.env.GOOGLE_CLIENT_ID,
    "Type:",
    typeof process.env.GOOGLE_CLIENT_ID
  );
  console.log(
    "GOOGLE_CLIENT_SECRET:",
    process.env.GOOGLE_CLIENT_SECRET,  // 수정된 부분
    "Type:",
    typeof process.env.GOOGLE_CLIENT_SECRET
  );
  console.log(
    "GOOGLE_CALLBACK_URL:",
    process.env.GOOGLE_CALLBACK_URL,
    "Type:",
    typeof process.env.GOOGLE_CALLBACK_URL
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // 수정된 부분
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          const exUser = await User.findOne({
            where: { google_id: profile.id },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              google_id: profile.id,
              user_name: profile.displayName,
              email: profile.emails[0].value,
              is_active: 1,
            });
            done(null, newUser);
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};

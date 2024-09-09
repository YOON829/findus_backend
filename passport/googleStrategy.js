const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy; // Google OAuth 2.0 전략

const User = require("../models/user");

module.exports = () => {
  // Google OAuth 설정: 사용자가 Google로 로그인할 수 있도록 설정
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID, // Google 클라이언트 ID
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google 클라이언트 비밀키
        callbackURL: "/auth/callback", // 인증 후 리디렉션될 URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ where: { googleId: profile.id } }); // 기존 사용자 검색
          if (!user) {
            user = await User.create({
              googleId: profile.id,
              token: accessToken,
            }); // 신규 사용자 생성
          }
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          }); // JWT 토큰 생성
          return done(null, { user, token }); // 사용자 정보와 토큰을 반환
        } catch (error) {
          return done(error, null); // 오류 발생 시 처리
        }
      }
    )
  );
};

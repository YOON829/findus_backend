const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const google = require("./googleStrategy");
const User = require("../models/user");

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log("serialize");
    done(null, user.user.id); // 세션에 사용자 ID 저장
  });

  passport.deserializeUser(async (id, done) => {
    console.log("deserialize");
    try {
      const user = await User.findByPk(id); // 세션에서 사용자 ID로 사용자 정보 복구
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  local();
  kakao();
  google();
};

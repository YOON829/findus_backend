
const passport = require("passport");
const google = require("./googleStrategy");

const { User } = require("../models");

module.exports = () => {
  // 세션에 user_id만 저장
  passport.serializeUser((user, done) => {
    done(null, user.user_id); // 세션에 user_id 저장
  });

  // 세션에서 user_id를 기반으로 사용자 정보를 복원
  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { user_id: id },
    })
      .then((user) => {
        done(null, user); // 사용자 정보를 복원하여 req.user에 저장
      })
      .catch((err) => done(err));
  });

  // Google OAuth 전략 실행
  google();
};


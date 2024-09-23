module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) { // 세션이나 JWT를 사용한 인증 확인
    return next();
  } else {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
};

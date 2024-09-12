exports.sessionCheck = (req, res) => {
  console.log(">>>>Session ID:", req.sessionID);
  console.log(">>>>Session Data:", req.session);
  console.log(">>>>Authenticated", req.isAuthenticated());
  // console.log(req);

  console.log(">>>>req.user :", req.user);

  // 유저정보를 확인하는법
  if (req.isAuthenticated()) {
    console.log(">>>>req.user.dataValues :", req.user.dataValues);

    const { google_id, user_name, email, is_active } = req.user.dataValues;
    const userData = {
      google_id: google_id, // TODO:어떤내용을 넣을지 협의 후 진행
      user_name: user_name,
      email: email,
      is_active: is_active,
    };

    res.json({ isLoggedIn: true, user: userData });
  } else {
    console.log(">>>>Session ID:", req.sessionID);
    res.json({ isLoggedIn: false, user: null });
  }
};
//이 부분을 세션체크하는 부분 만들기.

exports.googleLogout = async (req, res, next) => {
  console.log(req.isAuthenticated());
  // 비동기 함수로 변경
  try {
    // Passport 로그아웃 및 세션 삭제
    await new Promise((resolve, reject) => {
      req.logout((err) => {
        if (err) return reject(err);
        req.session.destroy((err) => {
          if (err) return reject(err);
          res.clearCookie("connect.sid", {
            // domain: 'localhost',  // 로컬 환경에서는 일반적으로 설정하지 않아도 됨
            secure: process.env.NODE_ENV === "production", // secure 옵션 일치
            httpOnly: true, // httpOnly 옵션 일치
            expires: new Date(0), // 과거 날짜로 설정하여 즉시 삭제되도록 설정
          }); // 세션 쿠키 삭제
          resolve();
        });
      });
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("로그아웃 처리 중 오류 발생:", err);
    return next(err); // 오류를 Express 에러 핸들러로 전달
  }
};

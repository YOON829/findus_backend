// // backend/routes/auth.js
// const express = require('express');
// const passport = require('passport');
//
// const router = express.Router();
//
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
//
// router.get('/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
//     res.json({ token: req.user.token });
// });
//
// router.get('/logout', (req, res) => {
//     req.logout((err) => {
//         if (err) {
//             return res.status(500).send('Failed to log out');
//         }
//         req.session.destroy(); // 세션 제거
//         res.clearCookie('connect.sid'); // 세션 쿠키 제거
//         res.status(200).send('Logged out successfully'); // 성공적으로 로그아웃되었음을 클라이언트에 알림
//     });
// });
// module.exports = router;




// express라는 웹서버 라이브러리를 가져오는 코드
const express = require("express");
// router라는 여러가지 경로(주소)를 쉽게 관리해주는 도구
const router = express.Router();
// 'passport'는 로그인, 로그아웃 같은 인증을 도와주는 도구야. 여기서는 구글 로그인을 도와줘.
const passport = require("passport");
// 'auth' 파일에서 만든 'googleLogout'과 'sessionCheck'라는 기능을 불러오는 거야.
// 각각 로그아웃과 세션 체크를 하는 기능이야.
const { googleLogout, sessionCheck } = require("../controllers/auth");

// '/googleLogout'이라는 주소로 요청이 들어오면 'googleLogout' 기능을 실행시켜서 로그아웃을 해.
router.post("/googleLogout", googleLogout);
// '/session-check'라는 주소로 요청이 들어오면 'sessionCheck' 기능을 실행시켜서 로그인 상태를 확인해.
router.get("/session-check", sessionCheck);

router.get(
  //구글로그인 시작주소
  "/google",
  passport.authenticate("google", {
    // 'openid', 'profile', 'email' 정보에 대한 구글 권한을 요청해.
    // 구글이 사용자의 정보를 제공할 수 있도록 허락을 구하는 거야.
    scope: ["openid", "profile", "email"],
    // 만약 로그인에 실패하면 이 경로로 보내서 '구글 로그인 실패' 메시지를 보여줄 거야.
    failureRedirect: "/?loginError=구글로그인 실패",
  }),
  (req, res) => {
    // 로그인에 성공하면 사용자를 'http://localhost:3000'으로 보내줘.
    // 보통 프론트엔드 화면으로 돌아가게 하는 거야.
    res.redirect("http://localhost:3000");
  }
);

router.get(
  // 구글이 로그인 처리를 다 한 후에, 결과를 여기로 보내줘.
  // 그래서 이 주소가 구글 로그인의 마지막 단계야.
  "/google/callback",
  passport.authenticate("google", {
    // 로그인이 실패하면 다시 실패 메시지를 보내줄 거야.
    failureRedirect: "/?loginError=구글로그인 실패",
  }),
  (req, res) => {
    // 로그인 성공 시, accessToken과 profile 정보를 프론트엔드로 전달
    // 로그인 세션의 ID를 확인해. 서버가 사용자 로그인 상태를 기억할 때 사용하는 정보야.
    console.log("connect.sid", req.cookies["connect.sid"]);
    // 사용자의 구글 로그인 'AccessToken'을 확인해.
    // 이 토큰을 통해 구글이 사용자 정보를 확인할 수 있어.
    console.log("AccessToken", req.cookies["accessToken"]);

    console.log(req.authInfo.accessToken);
    console.log(req.authInfo);

    // 마지막으로 사용자를 다시 'http://localhost:3000' 프론트엔드 화면으로 보내줘.
    res.redirect("http://localhost:3000");
  }
);

module.exports = router;

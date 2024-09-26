// express라는 웹서버 라이브러리를 가져오는 코드
const express = require("express");
// router라는 여러가지 경로(주소)를 쉽게 관리해주는 도구
const router = express.Router();
// 'passport'는 로그인, 로그아웃 같은 인증을 도와주는 도구야. 여기서는 구글 로그인을 도와줘.
const passport = require("passport");
// 'auth' 파일에서 만든 'googleLogout'과 'sessionCheck'라는 기능을 불러오는 거야.
// 각각 로그아웃과 세션 체크를 하는 기능이야.
const { googleLogout, sessionCheck } = require("../controllers/auth");
const { User } = require("../models"); // User 모델 import

const frontendUrl = process.env.FRONTEND_URL || "https://findus-jp.link";  // 프론트엔드 URL 설정

// 로그아웃 처리
router.post("/googleLogout", googleLogout);

// 세션 체크
router.get("/session-check", async (req, res) => {
    console.log(">>>> Session Data:", req.session);  // 세션 데이터 확인용


  if (req.session.user_id) {
    try {
      const user = await User.findByPk(req.session.user_id);
      if (user) {
        res.json({
          loggedIn: true,
          user: {
            user_id: user.user_id,
            google_id: user.google_id,
            user_name: user.user_name,
            email: user.email,
            is_active: user.is_active,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
        });
      } else {
        res.status(404).json({ loggedIn: false, message: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      res
        .status(500)
        .json({ loggedIn: false, message: "Internal server error" });
    }
  } else {
    res.status(401).json({ loggedIn: false, message: "User not logged in" });
  }
});

// 구글 로그인 시작 주소
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["openid", "profile", "email"], // 구글 권한 요청
    failureRedirect: "/?loginError=구글로그인 실패", // 로그인 실패 시 경로
  })
);

// 구글 로그인 콜백 처리
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/?loginError=구글로그인 실패",
  }),
  (req, res) => {
    console.log("req.user:", req.user); // req.user 확인

    if (req.user) {
      req.session.user_id = req.user.user_id; // 세션에 user_id 저장
      console.log("로그인 성공, 세션에 저장된 user_id:", req.session.user_id);
      res.redirect(`${frontendUrl}`);
    } else {
      return res.status(401).send("User not logged in");
    }
  }
);

module.exports = router;

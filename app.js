const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");

const passport = require("passport");
const cors = require("cors"); // CORS 설정을 위한 미들웨어

dotenv.config();

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });  // 프로덕션 환경
} else {
  dotenv.config({ path: '.env.development' });  // 개발 환경
}

const routes = require("./routes");
const imageRoutes = require("./routes/image");
const workRoutes = require("./routes/work");
const authRoutes = require("./routes/authRoutes"); // 인증 라우트
const placeRoutes = require("./routes/place");

const { sequelize } = require("./models");
const passportConfig = require("./passport");

const app = express();
passportConfig(); // 패스포트 설정
app.set("port", process.env.PORT || 5000);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

// CORS 설정: 프론트엔드의 요청을 허용
app.use(
  cors({
    origin: process.env.FRONTEND_URL,  // 환경 변수로 프론트엔드 URL 설정
    credentials: true,  // 쿠키를 포함한 요청을 허용
  })
);

// photodata 폴더를 정적으로 제공하는 설정
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 쿠키 유효 기간 (1일)
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth 인증 성공 후 처리
app.get(
  "/auth/callback",
  passport.authenticate("google", {
    failureRedirect: "/", // 인증 실패 시 리디렉션될 URL
  }),
  (req, res) => {
    const token = req.user.token; // 인증 후 발급된 토큰
    res.redirect(`http://localhost:3000?token=${token}`); // 프론트엔드로 토큰 전달
  }
);

// 라우트 설정
app.use("/api", routes);
app.use("/api/image", imageRoutes); // 이미지 관련 라우트
app.use("/api/work", workRoutes); // 모든 작품 관련 라우트를 /api/work로 접근 가능하게 함
app.use("/auth", authRoutes); // 인증 라우트 등록
app.use("/", placeRoutes);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});

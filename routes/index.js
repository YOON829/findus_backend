const express = require("express");
const placeRoutes = require("./place");
const workRoutes = require("./work");
const imageRoutes = require("./image");
const authRoutes = require("./auth"); // 인증 라우트

const {
  getEpisodesBySeason,
  getLocationByEpisode,
} = require("../controllers/work");

const router = express.Router();

router.use("/place", placeRoutes);
router.use("/work", workRoutes);
router.use("/image", imageRoutes);
router.use("/auth", authRoutes); // 인증 라우트 등록 // '/api/auth'로 입력 했으므로, 하위 라우터는 이 뒷부분만 입력해도 됨.


module.exports = router;

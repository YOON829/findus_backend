const express = require("express");
const placeRoutes = require("./place");
const workRoutes = require("./work");
const imageRoutes = require("./image");
const authRoutes = require("./auth"); // 인증 라우트
const reviewRoutes = require("./review"); // 리뷰 라우터 추가
const bookmarkRoutes = require("./bookmark");

const {
  getEpisodesBySeason,
  getLocationByEpisode,
} = require("../controllers/work");

const router = express.Router();

router.use("/place", placeRoutes);
router.use("/work", workRoutes);
router.use("/image", imageRoutes);
router.use("/auth", authRoutes);
router.use("/reviews", reviewRoutes);
router.use("/bookmark", bookmarkRoutes); // 북마크 관련 API 라우트

module.exports = router;

//gpt
const express = require("express");
const { Work } = require("../models");
const {
  getWorkById,
  getAllWorks,
  getWorkDetails,
  getSeasonEpisodes,
  getAllSeasonsForWork,
  getSeasonDetails,
} = require("../controllers/work");

const router = express.Router();

// 영어 -> 한국어 매핑 사전
const workNameMap = {
  sunshine: "러브 라이브! 선샤인!!",
  nijigasaki: "러브 라이브! 니지가사키 학원 스쿨 아이돌 동호회",
  superstar: "러브 라이브! 슈퍼스타!!",
  hasunosora: "러브 라이브! 하스노소라 여학원 스쿨 아이돌 클럽",
  bocchi: "봇치 더 록!",
  movie: "극장판"
};

// 모든 작품 목록 가져오기
router.get("/all", getAllWorks);

// 특정 작품의 소개 및 시즌 목록 가져오기
router.get("/:workKey", getWorkDetails);

// 특정 시즌의 에피소드 목록 가져오기
router.get("/:workKey/season/:seasonKey", getSeasonEpisodes);

// 특정 작품의 모든 시즌 목록 가져오기
router.get("/:workKey/seasons", getAllSeasonsForWork);

// 특정 시즌의 세부 정보 가져오기
router.get("/:workKey/:seasonKey", getSeasonDetails);

module.exports = router;

//
// const express = require("express");
// const {
//   getWorkById,
//   getAllWorks,
//   getWorkDetails,
//   getSeasonEpisodes,
//   getAllSeasonsForWork,
//   getSeasonDetails,
// } = require("../controllers/work");
//
// const router = express.Router();
//
//
// // 영어 -> 한국어 매핑 사전
// const workNameMap = {
//   sunshine: "러브 라이브! 선샤인!!",
//   nijigasaki: "러브 라이브! 니지가사키 학원 스쿨 아이돌 동호회",
//   superstar: "러브 라이브! 슈퍼스타!!",
//   hasunosora: "러브 라이브! 하스노소라 여학원 스쿨 아이돌 클럽",
//   bocchi: "봇치 더 록!",
// };
//
// // 모든 작품 목록 가져오기
// router.get("/all", getAllWorks);
//
// // 특정 작품의 소개 및 시즌 목록 가져오기
// router.get("/:workKey", getWorkDetails);
//
// // 특정 시즌의 에피소드 목록 가져오기
// router.get("/:workKey/:seasonKey", getSeasonEpisodes);
//
// // 특정 작품의 모든 시즌 목록 가져오기
// router.get("/:workKey/seasons", getAllSeasonsForWork);
//
// // 특정 시즌의 세부 정보 가져오기 (엔드포인트 수정)
// router.get("/:workKey/:seasonKey", getSeasonDetails);
//
// module.exports = router;
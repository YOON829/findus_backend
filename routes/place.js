const express = require("express");
const { getAllPlaces, getPlaceById, getAllRegions, getCitiesByRegion ,getPlacesByCity,  getPlacesByDistrict } = require("../controllers/place");

const router = express.Router();

// GET /api/place - 모든 Place 데이터 가져오기
router.get("/", getAllPlaces);

// GET /api/place/:id - 특정 ID의 Place 데이터 가져오기
router.get("/:id", getPlaceById);



// 모든 지역 목록 가져오기
router.get('/api/regions',getAllRegions );



// GET /api/regions/:region - 특정 지역에 속한 도시들 가져오기
router.get('/api/regions/:region', getCitiesByRegion);

// GET /api/regions/:region/:city - 특정 도시와 관련된 구역들 가져오기
router.get('/api/regions/:region/:city', getPlacesByCity);

// 특정 구역에 속한 장소들 가져오기
router.get('/api/regions/:region/:city/:district', getPlacesByDistrict);



module.exports = router;

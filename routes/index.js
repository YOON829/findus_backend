const express = require("express");
const placeRoutes = require("./place");
const workRoutes = require("./work");
const imageRoutes = require("./image");
const {
  getEpisodesBySeason,
  getLocationByEpisode,
} = require("../controllers/work");

const router = express.Router();

router.use("/place", placeRoutes);
router.use("/work", workRoutes);
router.use("/image", imageRoutes);

module.exports = router;

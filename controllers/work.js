const db = require("../models");
const { Op } = require("sequelize");

// 영어 -> 한국어 매핑 사전
// 이 객체는 영어 키를 한국어 작품 이름으로 변환하는 매핑 사전입니다.
const workNameMap = {
  sunshine: "러브 라이브! 선샤인!!",
  nijigasaki: "러브 라이브! 니지가사키 학원 스쿨 아이돌 동호회",
  superstar: "러브 라이브! 슈퍼스타!!",
  hasnosora: "러브 라이브! 하스노소라 여학원 스쿨 아이돌 클럽",
  bocchi: "봇치 더 록!",
  movie: "극장판",
};

// 시즌별 work_id 범위 설정
// 각 작품의 시즌별로 해당하는 work_id 범위를 정의한 객체입니다.
const workIdRanges = {
  sunshine: {
    1: [1, 13], // 시즌 1: work_id 1 ~ 13
    2: [14, 26], // 시즌 2: work_id 14 ~ 26
    극장판: [27, 27], // 극장판: work_id 27
    pv: [28, 31], // PV: work_id 28 ~ 31
  },
  nijigasaki: {
    1: [32, 44], // 시즌 1: work_id 32 ~ 44
    2: [45, 57], // 시즌 2: work_id 45 ~ 57
    ova: [58, 58], // OVA: work_id 58
    pv: [59, 60], // PV: work_id 59 ~ 60
  },
  superstar: {
    1: [61, 73], // 시즌 1: work_id 61 ~ 73
    2: [74, 86], // 시즌 2: work_id 74 ~ 86
  },
  hasnosora: {
    "103기": [99, 99], // 추가된 항목
    "104기": [100, 100], // 추가된 항목
    "103기 페스라이브": [101, 112], // 추가된 항목
    "104기 페스라이브": [113, 114], // 추가된 항목
  },
  bocchi: {
    1: [87, 98], // 시즌 1: work_id 87 ~ 98
  },
};

// 작품 ID로 작품 가져오기
// 주어진 작품 ID로 해당 작품 정보를 가져오는 함수입니다.
const getWorkById = async (req, res) => {
  try {
    const workId = req.params.id;
    const work = await db.Work.findOne({ where: { work_id: workId } });

    if (!work) {
      return res.status(404).json({ message: "Work not found" });
    }

    res.json(work);
  } catch (error) {
    console.error("Error fetching work:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 모든 작품 가져오기
// 데이터베이스에 있는 모든 작품을 가져오는 함수입니다.
const getAllWorks = async (req, res) => {
  try {
    const works = await db.Work.findAll({
      attributes: ["work_name", "poster"],
      group: ["work_name"],
      limit: 5,
    });

    const uniqueWorks = works.reduce((acc, work) => {
      if (!acc.find((w) => w.work_name === work.work_name)) {
        acc.push(work.toJSON());
      }
      return acc;
    }, []);

    const worksWithKeys = uniqueWorks.map((work) => ({
      ...work,
      work_key:
        Object.keys(workNameMap).find(
          (key) => workNameMap[key] === work.work_name
        ) || work.work_name,
    }));

    res.json(worksWithKeys);
  } catch (error) {
    console.error("Error fetching works:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 특정 작품의 세부 정보 가져오기
// 주어진 작품 키(workKey)에 해당하는 작품의 세부 정보를 가져오는 함수입니다.
const getWorkDetails = async (req, res) => {
  try {
    const { workKey } = req.params;
    const koreanWorkName = workNameMap[workKey];

    if (!koreanWorkName) {
      return res.status(404).json({ message: "작품을 찾을 수 없습니다." });
    }

    const work = await db.Work.findOne({
      where: { work_name: koreanWorkName },
      attributes: [
        "work_name",
        "description",
        "poster",
        "start_date",
        "end_date",
      ],
    });

    if (!work) {
      return res.status(404).json({ message: "작품 정보를 찾을 수 없습니다." });
    }

    const seasons = await db.Work.findAll({
      where: { work_name: koreanWorkName },
      attributes: ["work_season", "poster"], // 시즌 정보와 포스터 정보를 가져옵니다.
      group: ["work_season", "poster"],
      order: [["work_season", "ASC"]],
    });

    // 시즌 정보를 가공합니다.
    const processedSeasons = seasons.map((season) => ({
      season: season.work_season,
      season_key: season.work_season,
      display_name: season.work_season,
      poster: season.poster,
    }));

    res.json({
      work: {
        ...work.toJSON(),
        work_key: workKey,
      },
      seasons: processedSeasons,
    });
  } catch (error) {
    console.error("Error fetching work details:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 특정 시즌의 에피소드 가져오기
// 주어진 작품 키와 시즌 키에 해당하는 모든 에피소드를 가져오는 함수입니다.
const getSeasonEpisodes = async (req, res) => {
  try {
    const { workKey, seasonKey } = req.params;
    const koreanWorkName = workNameMap[workKey]; // 작품 키를 사용해 한국어 작품 이름을 찾습니다.

    if (!koreanWorkName) {
      return res.status(404).json({ message: "작품을 찾을 수 없습니다." });
    }

    const episodes = await db.Work.findAll({
      where: {
        work_name: koreanWorkName,
        work_season: seasonKey,
      },
      attributes: [
        "work_name",
        "work_season",
        "description",
        "poster",
        "start_date",
        "end_date",
        "genre",
        "director",
        "series_writer",
      ], // 필요한 필드만 가져옵니다.
      order: [["work_ep", "ASC"]], // 에피소드를 오름차순으로 정렬합니다.
    });

    if (episodes.length === 0) {
      return res
        .status(404)
        .json({ message: "해당 시즌의 에피소드를 찾을 수 없습니다." });
    }

    res.json(episodes); // 에피소드 리스트를 반환합니다.
  } catch (error) {
    console.error("Error fetching season episodes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 특정 작품의 모든 시즌 가져오기
// 주어진 작품 키에 해당하는 모든 시즌 정보를 가져오는 함수입니다.
const getAllSeasonsForWork = async (req, res) => {
  try {
    const { workKey } = req.params;
    const koreanWorkName = workNameMap[workKey]; // 작품 키를 사용해 한국어 작품 이름을 찾습니다.

    if (!koreanWorkName) {
      return res.status(404).json({ error: "작품을 찾을 수 없습니다." });
    }

    const seasons = await db.Work.findAll({
      where: { work_name: koreanWorkName },
      attributes: ["work_season"],
      group: ["work_season"],
      order: [["work_season", "ASC"]], // 시즌을 오름차순으로 정렬합니다.
    });

    // 시즌 정보를 변환하여 반환합니다.
    const processedSeasons = seasons.map((season) => ({
      season: season.work_season,
      season_key: season.work_season,
      display_name: getSeasonDisplayName(season.work_season),
    }));

    res.json(processedSeasons);
  } catch (error) {
    console.error("Error fetching seasons:", error);
    res.status(500).json({ error: "서버 내부 오류가 발생했습니다." });
  }
};

// 시즌 이름을 변환
// 한글 시즌 이름을 영어로 변환하는 함수입니다.
const getSeasonDisplayName = (season) => {
  switch (season.toLowerCase()) {
    case "극장판":
      return "movie"; // 극장판 -> movie
    case "ova":
      return "OVA"; // OVA -> OVA
    case "pv":
      return "PV"; // PV -> PV
    case "103기":
      return "103기";
    case "104기":
      return "104기";
    case "103기 페스라이브":
      return "103기 페스라이브";
    case "104기 페스라이브":
      return "104기 페스라이브";
    default:
      return `${season}`; // 변환이 필요 없는 경우 그대로 반환
  }
};

// 특정 시즌의 세부 정보 및 관련 장소와 이미지 가져오기
// 주어진 작품 키와 시즌 키에 해당하는 세부 정보 및 관련 장소와 이미지를 가져오는 함수입니다.
const getSeasonDetails = async (req, res) => {
  try {
    const { workKey, seasonKey } = req.params;
    const koreanWorkName = workNameMap[workKey]; // 작품 키를 사용해 한국어 작품 이름을 찾습니다.

    // 시즌에 해당하는 work_id 범위 가져오기
    const workRange = workIdRanges[workKey][seasonKey];
    if (!workRange) {
      return res
        .status(404)
        .json({ message: "해당 시즌 정보를 찾을 수 없습니다." });
    }

    // 시즌 세부 정보를 가져옵니다.
    const seasonDetails = await db.Work.findOne({
      where: {
        work_name: koreanWorkName,
        work_season: seasonKey,
      },
      attributes: [
        "work_id",
        "work_name",
        "work_season",
        "description",
        "poster",
        "start_date",
        "end_date",
        "genre",
        "director",
        "series_writer",
      ], // work_id로 수정
    });

    if (!seasonDetails) {
      return res
        .status(404)
        .json({ message: "해당 시즌 정보를 찾을 수 없습니다." });
    }

    // 해당 work_id 범위에 속하는 모든 장소와 이미지 가져오기
    const places = await db.Place.findAll({
      where: {
        work_id: {
          [Op.between]: workRange, // work_id 범위를 사용하여 장소를 필터링합니다.
        },
      },
      include: [
        {
          model: db.Image,
          attributes: ["image_url"], // 이미지 URL만 가져옵니다.
        },
      ],
    });

    // 특정 폴더(realPlace)의 이미지만 필터링
    const filteredPlaces = places.map((place) => {
      const filteredImages = place.Images.filter((image) =>
        image.image_url.includes("/realPlace/")
      );
      return {
        ...place.toJSON(),
        Images: filteredImages,
      };
    });

    // 시즌 세부 정보와 필터링된 장소 정보를 JSON 형식으로 반환합니다.
    res.json({
      seasonDetails: seasonDetails.toJSON(), // 시즌 세부 정보
      places: filteredPlaces, // 관련된 장소와 필터링된 이미지들
    });
  } catch (error) {
    console.error("Error fetching season details and places:", error);
    res.status(500).json({ error: "서버 내부 오류가 발생했습니다." });
  }
};

// 모듈로 내보내기
// 이 모듈에서 정의된 함수를 외부에서 사용할 수 있도록 내보냅니다.
module.exports = {
  getWorkById,
  getAllWorks,
  getWorkDetails,
  getSeasonEpisodes,
  getAllSeasonsForWork,
  getSeasonDetails,
};

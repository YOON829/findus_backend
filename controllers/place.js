const db = require('../models');  // models/index.js 파일에서 Sequelize 인스턴스를 가져옵니다.

const mappings = {
    region: {
        shizuoka: '시즈오카',
        kanagawa: '가나가와',
        tokyo: '도쿄',
        ishikawa: '이시카와',
        chiba: '치바'
    },
    city: {
        numazu: '누마즈',
        kamakura: '가마쿠라',
        fujisawa: '후지사와',
        tokyo: '도쿄',
        kanazawa: '카나자와',
        hakusan: '하쿠산',
        narita: '나리타'
    },
    district: {
        numazu: '누마즈시내',
        uchiura: '우치우라',
        kamakura: '가마쿠라시내',
        enoshima: '에노시마',
        odaiba: '오다이바',
        harajuku: '하라주쿠',
        shimokitazawa: '시모키타자와',
        akihabara: '아키하바라',
        kanazawa: '카나자와',
        hakusan: '하쿠산시',
        narita: '나리타'
    }
};

// 매핑된 값 가져오기 함수
function getMappedValue(type, key) {
    return mappings[type][key.toLowerCase()];
}

// 모든 Place 가져오기
const getAllPlaces = async (req, res) => {
  try {
    const places = await db.Place.findAll();
    res.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 특정 ID의 Place와 관련된 Work 및 Image 가져오기
const getPlaceById = async (req, res) => {
  try {
    const placeId = req.params.id;
    const place = await db.Place.findOne({
      where: { place_id: placeId },
      include: [
        {
          model: db.Work,
          attributes: ['work_name', 'work_season', 'work_ep'],
        },
        {
          model: db.Image,
          attributes: ['image_url'],
        },
      ],
    });

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json(place);
  } catch (error) {
    console.error('Error fetching place with related data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllRegions = async (req, res) => {
  try {
    const regions = await db.Place.findAll({
      attributes: ['address_region'], // 지역 이름만 가져옵니다.
      group: ['address_region'] // 중복된 지역 이름을 제거합니다.
    });

    const regionNames = regions.map(region => region.address_region);
    res.json(regionNames);
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
  }
};



const getCitiesByRegion = async (req, res) => {
    const region = getMappedValue('region', req.params.region); // '시즈오카'로 매핑

    console.log('Mapped Region:', region);

    if (!region) {
        return res.status(404).json({ error: '지역을 찾을 수 없습니다.' });
    }

    try {
        const cities = await db.Place.findAll({
            where: {
                address_region: region
            },
            attributes: ['address_city', 'address_region'],
            group: ['address_city'] // 도시별로 그룹화
        });

        if (cities.length === 0) {
            return res.status(404).json({ error: '도시 목록을 찾을 수 없습니다.' });
        }

        // 첫 번째 결과의 address_region을 가져와서 응답에 포함시킴
        const addressRegion = cities[0].address_region;
        const cityNames = cities.map(city => city.address_city);

        console.log('Found Cities:', cityNames);

        res.json({
            region: addressRegion, // 지역명
            cities: cityNames // 도시 목록
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: '도시 정보를 가져오는 중 오류가 발생했습니다.' });
    }
};

const getPlacesByCity = async (req, res) => {
    const region = getMappedValue('region', req.params.region); // '시즈오카'로 매핑
    const city = getMappedValue('city', req.params.city); // '누마즈'로 매핑

    console.log('Mapped Region:', region);
    console.log('Mapped City:', city);

    if (!region || !city) {
        return res.status(404).json({ error: '지역이나 도시를 찾을 수 없습니다.' });
    }

    try {
        // 특정 지역과 도시에 속하는 장소들만 가져오기
        const places = await db.Place.findAll({
            where: {
                address_region: region,
                address_city: city
            },
               attributes: ['place_id', 'address_city' , 'place_name', 'address_district', 'marker_img'] // 필요한 필드만 선택

        });

        console.log('Found Places:', places); // 로그로 확인

        res.json(places); // 해당 장소들을 클라이언트로 반환
    } catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({ error: '장소 정보를 가져오는 중 오류가 발생했습니다.' });
    }
};

// 특정 District에 있는 Place 가져오기
const getPlacesByDistrict = async (req, res) => {
    const district = getMappedValue('district', req.params.district);

    try {
        const places = await db.Place.findAll({
            where: { address_district: district },
            include: [
                {
                    model: db.Image, // Image 모델을 포함
                    attributes: ['image_url'] // 필요한 필드만 선택
                }
            ]
        });
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: '장소 정보를 가져오는 중 오류가 발생했습니다.' });
    }
};

// 모듈 내보내기
module.exports = {
  getAllPlaces,
  getPlaceById,
  getAllRegions,
  getPlacesByDistrict,
  getCitiesByRegion,
  getPlacesByCity,
  mappings,
  getMappedValue // 이 함수는 필요 시 외부에서 사용할 수 있도록 내보내기

};
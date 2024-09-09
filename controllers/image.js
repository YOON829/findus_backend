const db = require('../models');


const getImagesByPlaceId = async (req, res) => {
  try {
    const placeId = req.params.place_id;
    const images = await db.Image.findAll({ where: { place_id: placeId } });

    if (images.length === 0) {
      return res.status(404).json({ message: 'No images found for this place' });
    }

    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// 특정 ID의 이미지 가져오기
const getImageById = async (req, res) => {
  try {
    const imageId = req.params.id;
    const image = await db.Image.findOne({ where: { image_id: imageId } });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getImagesByPlaceId,
  getImageById
};
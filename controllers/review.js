const { Review, User, Place, Image } = require('../models');

// 특정 장소의 리뷰 목록 조회 (로그인 필요 없음)
exports.getReviewsByPlace = async (req, res) => {
  const { place_id } = req.params;

  try {
    const reviews = await Review.findAll({
      where: { place_id },
      include: [{ model: User, attributes: ['user_name'] }], // 리뷰와 함께 사용자 이름도 가져오기
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("리뷰 조회 오류:", error);
    return res.status(500).json({ message: '리뷰 조회 중 오류가 발생했습니다.' });
  }
};

exports.getAllReviews = async (req, res) => {
  const user_id = req.session.user_id;

  if (!user_id) {
    return res.status(401).send("User not logged in");
  }

  try {
    const reviews = await Review.findAll({
      where: { user_id },
      include: [
        {
          model: User,
          attributes: ['user_name'], // 사용자 이름만 포함
        },
        {
          model: Place,
          include: [
            {
              model: Image,
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']], // 최신 리뷰부터 정렬
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve reviews",
      details: error.message,
    });
  }
};

// 리뷰 작성 (로그인한 사용자만)
exports.createReview = async (req, res) => {
  const { place_id, rating, comment } = req.body;
  const user_id = req.user.user_id; // 로그인된 사용자 ID 가져오기

  try {
    const newReview = await Review.create({
      place_id,
      user_id,
      rating,
      comment,
    });

    return res.status(201).json({ message: '리뷰가 성공적으로 저장되었습니다.', review: newReview });
  } catch (error) {
    console.error("리뷰 작성 오류:", error);
    return res.status(500).json({ message: '리뷰 작성 중 오류가 발생했습니다.' });
  }
};

// 리뷰 수정 (로그인한 사용자만)
exports.updateReview = async (req, res) => {
  const { review_id } = req.params;
  const { rating, comment } = req.body;
  const user_id = req.user.user_id; // 로그인된 사용자 ID 가져오기

  try {
    const review = await Review.findOne({ where: { review_id } });

    if (!review) {
      return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
    }

    if (review.user_id !== user_id) {
      return res.status(403).json({ message: '리뷰를 수정할 권한이 없습니다.' });
    }

    await review.update({ rating, comment });

    return res.status(200).json({ message: '리뷰가 성공적으로 수정되었습니다.', review });
  } catch (error) {
    console.error("리뷰 수정 오류:", error);
    return res.status(500).json({ message: '리뷰 수정 중 오류가 발생했습니다.' });
  }
};

// 리뷰 삭제 (로그인한 사용자만)
exports.deleteReview = async (req, res) => {
  const { review_id } = req.params;
  const user_id = req.user.user_id; // 로그인된 사용자 ID 가져오기

  try {
    const review = await Review.findOne({ where: { review_id } });

    if (!review) {
      return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
    }

    if (review.user_id !== user_id) {
      return res.status(403).json({ message: '리뷰를 삭제할 권한이 없습니다.' });
    }

    await review.destroy();

    return res.status(200).json({ message: '리뷰가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error("리뷰 삭제 오류:", error);
    return res.status(500).json({ message: '리뷰 삭제 중 오류가 발생했습니다.' });
  }
};

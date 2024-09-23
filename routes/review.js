const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  getReviewsByPlace,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/review');
const { isLoggedIn } = require('../middlewares/auth'); // 로그인 확인 미들웨어

// 모든 리뷰 가져오기
router.get('/', getAllReviews);

// 특정 장소의 리뷰 가져오기 (모든 사용자 가능)
router.get('/place/:place_id', getReviewsByPlace);

// 리뷰 작성 (로그인된 사용자만 가능)
router.post('/', isLoggedIn, createReview);

// 리뷰 수정 (로그인된 사용자만 가능)
router.put('/:review_id', isLoggedIn, updateReview);

// 리뷰 삭제 (로그인된 사용자만 가능)
router.delete('/:review_id', isLoggedIn, deleteReview);

module.exports = router;

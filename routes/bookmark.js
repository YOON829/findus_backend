
const express = require('express');
const bookmarkController = require('../controllers/bookmark');
const router = express.Router();

// 북마크 추가 API
router.post('/', bookmarkController.addBookmark);

// 북마크 삭제 API
router.delete('/:place_id', bookmarkController.deleteBookmark);

// 북마크 상태 확인 API
router.get('/check/:place_id', bookmarkController.checkBookmarkStatus);

// 사용자의 모든 북마크 조회 API
router.get('/', bookmarkController.getAllBookmarks);

module.exports = router;
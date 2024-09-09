// backend/routes/authRoutes.js
const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.json({ token: req.user.token });
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        req.session.destroy(); // 세션 제거
        res.clearCookie('connect.sid'); // 세션 쿠키 제거
        res.status(200).send('Logged out successfully'); // 성공적으로 로그아웃되었음을 클라이언트에 알림
    });
});
module.exports = router;

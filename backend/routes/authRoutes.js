const express = require('express');
const router = express.Router();
const { register, login, verifyTwoFactor, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-2fa', verifyTwoFactor);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

module.exports = router;

const express = require('express');
const router = express.Router();
const { listUsers, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/users', protect, adminOnly, listUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getPlanner, addWeek, updateWeek, deleteWeek } = require('../controllers/plannerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getPlanner);
router.post('/week', protect, addWeek);
router.put('/week/:weekId', protect, updateWeek);
router.delete('/week/:weekId', protect, deleteWeek);

module.exports = router;

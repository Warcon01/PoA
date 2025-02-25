const express = require('express');
const router = express.Router();
const { getJournals, addJournal, updateJournal, deleteJournal } = require('../controllers/journalController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getJournals);
router.post('/', protect, addJournal);
router.put('/:id', protect, updateJournal);
router.delete('/:id', protect, deleteJournal);

module.exports = router;

const Journal = require('../models/Journal');

exports.getJournals = async (req, res, next) => {
  try {
    const journals = await Journal.find({ user: req.user.id });
    res.json(journals);
  } catch (error) {
    next(error);
  }
};

exports.addJournal = async (req, res, next) => {
  try {
    const { date, name, content } = req.body;
    const journal = new Journal({ user: req.user.id, date, name, content });
    await journal.save();
    res.status(201).json(journal);
  } catch (error) {
    next(error);
  }
};

exports.updateJournal = async (req, res, next) => {
  try {
    const journalId = req.params.id;
    const { date, name, content } = req.body;
    const journal = await Journal.findOneAndUpdate(
      { _id: journalId, user: req.user.id },
      { date, name, content },
      { new: true }
    );
    if (!journal)
      return res.status(404).json({ message: "Journal entry not found" });
    res.json({ message: "Journal updated", journal });
  } catch (error) {
    next(error);
  }
};

exports.deleteJournal = async (req, res, next) => {
  try {
    const journalId = req.params.id;
    const journal = await Journal.findOneAndDelete({ _id: journalId, user: req.user.id });
    if (!journal)
      return res.status(404).json({ message: "Journal entry not found" });
    res.json({ message: "Journal deleted" });
  } catch (error) {
    next(error);
  }
};

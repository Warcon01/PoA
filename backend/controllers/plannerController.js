const Planner = require('../models/Planner');

exports.getPlanner = async (req, res, next) => {
  try {
    let planner = await Planner.findOne({ user: req.user.id });
    if (!planner) {
      planner = new Planner({ user: req.user.id, weeks: [] });
      await planner.save();
    }
    res.json(planner);
  } catch (error) {
    next(error);
  }
};

exports.addWeek = async (req, res, next) => {
  try {
    const { weekName } = req.body;
    if (!weekName) {
      return res.status(400).json({ message: "weekName is required" });
    }
    let planner = await Planner.findOne({ user: req.user.id });
    if (!planner) {
      planner = new Planner({ user: req.user.id, weeks: [] });
    }
    const newWeek = {
      weekName,
      days: {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
      }
    };
    planner.weeks.push(newWeek);
    await planner.save();
    res.status(201).json({ message: "Week added", week: planner.weeks[planner.weeks.length - 1] });
  } catch (error) {
    next(error);
  }
};

exports.updateWeek = async (req, res, next) => {
  try {
    const { weekId } = req.params;
    const updatedData = req.body; // expects { weekName?: string, days?: {...} }
    let planner = await Planner.findOne({ user: req.user.id });
    if (!planner) return res.status(404).json({ message: "Planner not found" });
    const week = planner.weeks.id(weekId);
    if (!week) return res.status(404).json({ message: "Week not found" });
    if (updatedData.weekName) week.weekName = updatedData.weekName;
    if (updatedData.days) week.days = updatedData.days;
    await planner.save();
    res.json({ message: "Week updated", week });
  } catch (error) {
    next(error);
  }
};

exports.deleteWeek = async (req, res, next) => {
  try {
    const { weekId } = req.params;
    let planner = await Planner.findOne({ user: req.user.id });
    if (!planner) return res.status(404).json({ message: "Planner not found" });
    const initialLength = planner.weeks.length;
    planner.weeks = planner.weeks.filter(
      (week) => week._id.toString() !== weekId
    );
    if (planner.weeks.length === initialLength) {
      return res.status(404).json({ message: "Week not found" });
    }
    await planner.save();
    res.json({ message: "Week deleted" });
  } catch (error) {
    next(error);
  }
};

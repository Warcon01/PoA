const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { _id: false });

const WeekSchema = new mongoose.Schema({
  weekName: { type: String, required: true },
  days: {
    Monday: [TaskSchema],
    Tuesday: [TaskSchema],
    Wednesday: [TaskSchema],
    Thursday: [TaskSchema],
    Friday: [TaskSchema],
    Saturday: [TaskSchema],
    Sunday: [TaskSchema]
  },
  createdAt: { type: Date, default: Date.now }
});

const PlannerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  weeks: [WeekSchema]
});

module.exports = mongoose.model('Planner', PlannerSchema);

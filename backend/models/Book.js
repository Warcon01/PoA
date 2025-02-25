const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Not Started", "In Process", "Finished"],
    default: "Not Started"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', BookSchema);

const mongoose = require("mongoose");

const SummarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  summary: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Summary", SummarySchema);
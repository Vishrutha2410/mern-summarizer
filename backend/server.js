const express =require("express");
const mongoose=require ("mongoose");
const cors=require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log(err));

// Schema
const SummarySchema = new mongoose.Schema({
  text: String,
  summary: String
});

const Summary = mongoose.model("Summary", SummarySchema);

// Route
app.post("/summarize", async (req, res) => {
  const { text } = req.body;

  // Simple fake summary (first 50 characters)
  const summary = text.substring(0, 50) + "...";

  const newSummary = new Summary({ text, summary });
  await newSummary.save();

  res.json({ summary });
});

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});
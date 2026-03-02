const express =require("express");
const mongoose=require ("mongoose");
const cors=require("cors");
const { HfInference } = require("@huggingface/inference");
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
  summary: String,
  createdAt: { type: Date, default: Date.now }
});

const Summary = mongoose.model("Summary", SummarySchema);
// Initialize Hugging Face client
const hfClient = new HfInference(process.env.HF_API_KEY);

// Helper: chunk text into smaller pieces
function chunkText(text, size = 1000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}
// Route
app.post("/summarize", async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === "") {return res.status(400).json({error:"Text is required"});}
  try{
     const chunks = chunkText(text, 1000);
    const summaries = [];

    for (const chunk of chunks) {
      const response = await hfClient.summarization({
  model: "sshleifer/distilbart-cnn-12-6",
  inputs: chunk,
  parameters:{
    max_length:150,
    min_length:30
  }
});
   let chunkSummary;
      if (Array.isArray(response)) {
        chunkSummary = response[0]?.summary_text;
      } else {
        chunkSummary = response?.summary_text;
      }

      summaries.push(chunkSummary || "");
    }

    // Combine all chunk summaries
    const finalSummary = summaries.join(" ").trim() || "Unable to summarize";

    // Save to MongoDB
    const newSummary = new Summary({ text, summary: finalSummary });
    await newSummary.save();

    res.json({ summary: finalSummary });
  }catch(error){
  console.error("Error summarizing:", error?.httpResponse || error);

    if (error?.httpResponse?.status === 403) {
      res.status(403).json({ error: "HF API token permission error" });
    } else if (error?.httpResponse?.status === 504) {
      res.status(504).json({ error: "HF API timeout, try shorter text" });
    } else {
      res.status(500).json({ error: "Failed to summarize text" });
    }
}
});
app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000 🚀");
});
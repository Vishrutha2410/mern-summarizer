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
  summary: String
});

const Summary = mongoose.model("Summary", SummarySchema);
// Hugging Face client
const hfClient = new HfInference(process.env.HF_API_KEY);

// Route
app.post("/summarize", async (req, res) => {
  const { text } = req.body;
  if(!text) return res.status(400).json({error:"Text is required"});
  try{
    // Call Hugging Face Inference API
   const hfResponse = await hfClient.summarization({
  model: "facebook/bart-large-cnn",
  inputs: text
});
    console.log("HF response:", hfResponse);
    // Hugging Face returns array with one result
    const summary = hfResponse[0]?.summary_text || "Unable to summarize";

    // Save to DB
    const newSummary = new Summary({ text, summary });
    await newSummary.save();

    res.json({ summary });
  }catch(error){
  console.error("Error summarizing:", error);
  res.status(500).json({error:"Failed to summarize text"});
}
});
app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000 🚀");
});
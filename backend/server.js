const express =require("express");
const mongoose=require ("mongoose");
const cors=require("cors");
require("dotenv").config();
const OpenAI=require("openai");

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

//OpenAI client
const openai=new OpenAI({
  apiKey:process.env.OPENAI_API_KEY
});

// Route
app.post("/summarize", async (req, res) => {
  const { text } = req.body;
  if(!text) return res.status(400).json({error:"Text is required"});
  try{
    //call openai api for summarization
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes text concisely." },
        { role: "user", content: `Please summarize the following text:\n\n${text}` }
      ],
      temperature: 0.5,
      max_tokens: 150
    });
  const summary = response.choices[0].message.content.trim();

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
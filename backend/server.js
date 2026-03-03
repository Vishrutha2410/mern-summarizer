const express =require("express");
const mongoose=require ("mongoose");
const cors=require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { HfInference } = require("@huggingface/inference");
require("dotenv").config();

const User = require("./models/User");
const Summary = require("./models/Summary");
const authMiddleware = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log(err));

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

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, name: user.name });

  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Route
app.post("/summarize", authMiddleware, async (req, res) => {
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
   const chunkSummary = Array.isArray(response)
        ? response[0]?.summary_text
        : response?.summary_text;

      summaries.push(chunkSummary || "");
    }

    const finalSummary = summaries.join(" ").trim();

    const newSummary = new Summary({
      userId: req.user.id,
      text,
      summary: finalSummary
    });

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

app.get("/my-summaries", authMiddleware, async (req, res) => {
  try {
    const summaries = await Summary.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(summaries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch summaries" });
  }
});

app.delete("/summary/:id", authMiddleware, async (req, res) => {
  try {
    await Summary.findByIdAndDelete(req.params.id);
    res.json({ message: "Summary deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000 🚀");
});
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const analyzeWithOpenAI  = require("./openai");
//console.log('Loaded API Key:', process.env.OPENAI_API_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

const upload = multer();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.post("/api/analyze", upload.single("resume"), async (req, res) => {
  try {
    const data = await pdfParse(req.file.buffer);
    const prompt = `
      Analyze the resume below and return a JSON object with the following fields:
      {
        "rating": "number out of 10",
        "career_paths": ["...", "..."],
        "strengths": ["...", "..."],
        "weaknesses": ["...", "..."],
        "soft_skills": ["...", "..."],
        "ats_match": "string",
        "project_ideas": ["...", "..."],
        "roadmap": ["Week 1: ...", "Week 2: ..."]
      }

      Resume:
      ${data.text}
      `;

    const result = await analyzeWithOpenAI(prompt);
    res.json({ message: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process resume" });
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
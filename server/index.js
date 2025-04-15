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
      Analyze the following resume and provide:
      1. Overall resume rating out of 10
      2. 3 suitable career paths
      3. Technical strengths
      4. Weak areas or missing topics
      5. Soft skill analysis
      6. ATS keyword match (for Software Engineer)
      7. Project recommendations to boost resume
      8. A 30-day upskilling roadmap

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
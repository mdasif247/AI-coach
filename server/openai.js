const axios = require("axios");
require("dotenv").config();

async function analyzeWithOpenRouter(prompt) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", // or any supported model
        messages: [
          { role: "system", content: "You are a helpful AI career coach." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter error:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = analyzeWithOpenRouter;

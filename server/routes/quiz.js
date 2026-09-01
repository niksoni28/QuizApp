const express = require("express");
const router = express.Router();
const { generateQuiz } = require("../services/geminiService");


router.post("/", async (req, res) => {
const { topic } = req.body;

if (!topic || topic.trim().length === 0) {
    return res.status(400).json({ error: "Please provide a topic or some notes." });
}

try {
    const rawText = await generateQuiz(topic);

    let parsed;
    try {
    parsed = JSON.parse(rawText);

    } 
    catch (parseErr) {

    console.log("Gemini returned non-JSON:", rawText);
    return res.status(502).json({ error: "The AI response wasn't valid JSON. Try again." });
    }

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
    return res.status(502).json({ error: "The AI response was missing the questions array." });
    }

    res.json(parsed);
  } 
    catch (err) {
    console.log("Gemini API error:", err.message);
    res.status(500).json({ error: "Something went wrong while generating the quiz." });
  }
  
});

module.exports = router;
const express = require("express");
const router = express.Router();
const { generateQuiz } = require("../services/geminiService");

function cleanResponseText(text) {
  // sometimes the model wraps the JSON in markdown code fences even when told not to
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

function isValidQuizShape(parsed) {
  if (!parsed || !Array.isArray(parsed.questions)) return false;
  if (parsed.questions.length !== 5) return false;

  for (const q of parsed.questions) {
    if (typeof q.question !== "string") return false;
    if (!Array.isArray(q.options) || q.options.length !== 4) return false;
    if (typeof q.correctIndex !== "number") return false;
    if (q.correctIndex < 0 || q.correctIndex > 3) return false;
  }

  return true;
}

router.post("/", async (req, res) => {
  const { topic } = req.body;

  if (!topic || topic.trim().length === 0) {
    return res.status(400).json({ error: "Please provide a topic or some notes." });
  }

  try {
    const rawText = await generateQuiz(topic);
    const cleanedText = cleanResponseText(rawText);

    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (parseErr) {
      console.log("Gemini returned non-JSON:", rawText);
      return res.status(502).json({ error: "The AI response wasn't valid JSON. Please try again." });
    }

    if (!isValidQuizShape(parsed)) {
      console.log("Gemini returned unexpected shape:", parsed);
      return res.status(502).json({ error: "The AI response wasn't in the right format. Please try again." });
    }

    res.json(parsed);
  } catch (err) {
    console.log("Gemini API error:", err.message);
    res.status(500).json({ error: "Something went wrong while generating the quiz. Please try again." });
  }
});

module.exports = router;
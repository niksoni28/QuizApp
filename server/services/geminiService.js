const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildPrompt(topic) {

    
return `You are generating a multiple choice quiz for a student.

Topic or notes given by the student:
"""
${topic}
"""

Create exactly 5 multiple choice questions based on this.

Reply with ONLY valid JSON, no extra text, no markdown formatting, no code fences.
Use this exact structure:

{
  "questions": [
    {
      "question": "the question text",
      "options": ["option A", "option B", "option C", "option D"],
      "correctIndex": 0
    }
  ]
}

correctIndex is the index (0 to 3) of the correct option in the options array.
Make sure there are exactly 4 options per question and exactly 5 questions total.`;



}

async function generateQuiz(topic) {
const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });



const prompt = buildPrompt(topic);
const result = await model.generateContent(prompt);
const rawText = result.response.text();



return rawText;
}

module.exports = { generateQuiz };
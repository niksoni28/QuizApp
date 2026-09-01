const API_URL = "http://localhost:5000/api/quiz";

export async function fetchQuiz(topic) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}
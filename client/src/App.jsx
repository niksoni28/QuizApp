import { useState } from "react";
import QuizForm from "./components/QuizForm";
import QuizView from "./components/QuizView";
import { fetchQuiz } from "./api/quiz";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [finished, setFinished] = useState(false);

  async function handleGenerate(topic) {
    setLoading(true);
    setError(null);
    setQuiz(null);
    setFinished(false);

    try {
      const data = await fetchQuiz(topic);
      setQuiz(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleQuizComplete(answers) {
    console.log("final answers", answers);
    setFinished(true);
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 px-4 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6">Study Quiz Generator</h1>

      {!quiz && (
        <QuizForm onSubmit={handleGenerate} loading={loading} />
      )}

      {error && (
        <p className="text-red-600 mt-4 text-sm">{error}</p>
      )}

      {quiz && !finished && (
        <QuizView questions={quiz.questions} onComplete={handleQuizComplete} />
      )}

      {finished && (
        <p className="text-green-700 mt-4 text-sm">
          Quiz finished. Results screen coming next.
        </p>
      )}
    </div>
  );
}

export default App;
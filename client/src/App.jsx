import { useState } from "react";
import QuizForm from "./components/QuizForm";
import QuizView from "./components/QuizView";
import ResultsView from "./components/ResultsView";
import { fetchQuiz } from "./api/quiz";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState(null);
  const [finalAnswers, setFinalAnswers] = useState(null);

  async function handleGenerate(topic) {
    setLoading(true);
    setError(null);
    setActiveQuestions(null);
    setFinalAnswers(null);

    try {
      const data = await fetchQuiz(topic);
      setActiveQuestions(data.questions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleQuizComplete(answers) {
    setFinalAnswers(answers);
  }

  function handleRetestWrong(wrongQuestions) {
    setActiveQuestions(wrongQuestions);
    setFinalAnswers(null);
  }

  function handleStartOver() {
    setActiveQuestions(null);
    setFinalAnswers(null);
    setError(null);
  }

  const showQuiz = activeQuestions && !finalAnswers;
  const showResults = activeQuestions && finalAnswers;

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 px-4 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6">Study Quiz Generator</h1>

      {!activeQuestions && (
        <QuizForm onSubmit={handleGenerate} loading={loading} />
      )}

      {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}

      {showQuiz && (
        <QuizView questions={activeQuestions} onComplete={handleQuizComplete} />
      )}

      {showResults && (
        <ResultsView
          questions={activeQuestions}
          answers={finalAnswers}
          onRetestWrong={handleRetestWrong}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
}

export default App;
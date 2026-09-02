import { useState, useRef } from "react";
import QuizForm from "./components/QuizForm";
import QuizView from "./components/QuizView";
import ResultsView from "./components/ResultsView";
import { fetchQuiz } from "./api/quiz";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState(null);
  const [finalAnswers, setFinalAnswers] = useState(null);
  const [lastTopic, setLastTopic] = useState("");

  const requestIdRef = useRef(0);

  async function runGenerate(topic) {
    const thisRequestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);
    setActiveQuestions(null);
    setFinalAnswers(null);
    setLastTopic(topic);

    try {
      const data = await fetchQuiz(topic);

      if (thisRequestId !== requestIdRef.current) return;

      setActiveQuestions(data.questions);
    } catch (err) {
      if (thisRequestId !== requestIdRef.current) return;
      setError(err.message);
    } finally {
      if (thisRequestId === requestIdRef.current) {
        setLoading(false);
      }
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

  function handleRetry() {
    if (lastTopic) runGenerate(lastTopic);
  }

  const showQuiz = activeQuestions && !finalAnswers;
  const showResults = activeQuestions && finalAnswers;

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 px-4 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6">Study Quiz Generator</h1>

      {!activeQuestions && (
        <QuizForm onSubmit={runGenerate} loading={loading} />
      )}

      {error && (
        <div className="mt-4 text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-2 text-sm underline text-blue-600"
          >
            Try again
          </button>
        </div>
      )}

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
import { useState, useRef, useEffect } from "react";
import QuizForm from "./components/QuizForm";
import QuizView from "./components/QuizView";
import ResultsView from "./components/ResultsView";
import { fetchQuiz } from "./api/quiz";

const STORAGE_KEY = "quizAppSession";

function loadSavedSession() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch (err) {
    return null;
  }
}

function App() {
  const savedSession = loadSavedSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState(savedSession?.activeQuestions || null);
  const [finalAnswers, setFinalAnswers] = useState(savedSession?.finalAnswers || null);
  const [lastTopic, setLastTopic] = useState(savedSession?.lastTopic || "");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (activeQuestions) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ activeQuestions, finalAnswers, lastTopic })
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [activeQuestions, finalAnswers, lastTopic]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

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
    localStorage.removeItem(STORAGE_KEY);
  }

  function handleRetry() {
    if (lastTopic) runGenerate(lastTopic);
  }

  const showQuiz = activeQuestions && !finalAnswers;
  const showResults = activeQuestions && finalAnswers;

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 px-4 bg-gray-50 dark:bg-gray-900 transition-colors">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-gray-700 dark:text-gray-200"
      >
        {darkMode ? "Light mode" : "Dark mode"}
      </button>

      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Study Quiz Generator</h1>

      {!activeQuestions && (
        <QuizForm onSubmit={runGenerate} loading={loading} />
      )}

      {error && (
        <div className="mt-4 text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <button onClick={handleRetry} className="mt-2 text-sm underline text-blue-600">
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
function ResultsView({ questions, answers, onRetestWrong, onStartOver }) {
  const results = questions.map((q, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer === q.correctIndex;
    return { ...q, userAnswer, isCorrect };
  });

  const wrongQuestions = results.filter((r) => !r.isCorrect);
  const score = results.length - wrongQuestions.length;

  return (
    <div className="w-full max-w-xl">
      <h2 className="text-xl font-semibold mb-1">
        You got {score} out of {results.length} correct
      </h2>

      <div className="flex flex-col gap-3 mt-4">
        {results.map((r, index) => (
          <div
            key={index}
            className={`border rounded-lg p-3 text-sm ${
              r.isCorrect ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
            }`}
          >
            <p className="font-medium mb-1">{r.question}</p>
            <p>
              Your answer:{" "}
              {r.userAnswer === null || r.userAnswer === undefined
                ? "skipped"
                : r.options[r.userAnswer]}
            </p>
            {!r.isCorrect && (
              <p className="text-green-700">
                Correct answer: {r.options[r.correctIndex]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        {wrongQuestions.length > 0 && (
          <button
            onClick={() => onRetestWrong(wrongQuestions)}
            className="bg-blue-600 text-white rounded-lg py-2 px-4 font-medium hover:bg-blue-700"
          >
            Retest {wrongQuestions.length} wrong question{wrongQuestions.length > 1 ? "s" : ""}
          </button>
        )}
        <button
          onClick={onStartOver}
          className="border border-gray-300 rounded-lg py-2 px-4 font-medium hover:bg-gray-50"
        >
          New Quiz
        </button>
      </div>
    </div>
  );
}

export default ResultsView;
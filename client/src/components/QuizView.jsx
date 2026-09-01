import { useState } from "react";

function QuizView({ questions, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  function handleSelect(optionIndex) {
    setSelectedOption(optionIndex);
  }

  function handleNext() {
    const updatedAnswers = [...answers, selectedOption];

    if (isLastQuestion) {
      onComplete(updatedAnswers);
      return;
    }

    setAnswers(updatedAnswers);
    setSelectedOption(null);
    setCurrentIndex(currentIndex + 1);
  }

  return (
    <div className="w-full max-w-xl">
      <p className="text-sm text-gray-500 mb-2">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <h2 className="text-lg font-medium mb-4">{currentQuestion.question}</h2>

      <div className="flex flex-col gap-2">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            className={`text-left border rounded-lg px-4 py-2 text-sm ${
              selectedOption === index
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={selectedOption === null}
        className="mt-6 bg-blue-600 text-white rounded-lg py-2 px-6 font-medium hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLastQuestion ? "Finish Quiz" : "Next Question"}
      </button>
    </div>
  );
}

export default QuizView;
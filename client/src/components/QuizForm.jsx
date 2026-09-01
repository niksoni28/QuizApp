import { useState } from "react";

function QuizForm({ onSubmit, loading }) {
  const [topic, setTopic] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (topic.trim().length === 0) return;
    onSubmit(topic);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-xl">
      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Paste your notes or type a topic, like 'Photosynthesis' or 'World War 2 causes'"
        rows={5}
        className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Generating quiz..." : "Generate Quiz"}
      </button>
    </form>
  );
}

export default QuizForm;
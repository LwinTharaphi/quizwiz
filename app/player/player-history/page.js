"use client"
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa'; // For the cross icon

const playerHistoryData = [
  { id: 1, quiz: "Machine Learning Quiz", score: 100 },
  { id: 2, quiz: "Blockchain Quiz", score: 85 },
  { id: 3, quiz: "Cybersecurity Quiz", score: 90 },
  { id: 4, quiz: "Artificial Intelligence Quiz", score: 75 },
  // Add more records as needed
];

export default function PlayerHistory() {
  const [history, setHistory] = useState(playerHistoryData);

  // Function to delete a record
  const handleDelete = (id) => {
    setHistory(history.filter((item) => item.id !== id));
  };

  // Function to clear all records
  const handleClearAll = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {/* Navbar */}
      <div className="flex justify-between items-center px-4 py-2 text-black">
        <div className="flex items-center space-x-4">
          <img src="/quiz.png" alt="Logo" className="h-12 ml-10" />
        </div>
        <div className="flex space-x-4 w-2/5 justify-end mr-20">
          <a
            href="/player/categories"
            className="hover:underline flex items-center justify-center"
          >
            Home
          </a>
          <a
            href="/player/history"
            className="hover:underline border-2 border-blue-500 rounded-full px-4 py-2 transition-all duration-300 hover:bg-blue-100 flex items-center justify-center"
          >
            History
          </a>
          <a href="/" className="hover:underline flex items-center justify-center">Logout</a>
        </div>
      </div>

      {/* Clear All Button */}
      <div className="max-w-screen-lg mx-auto flex justify-end mb-6 px-4">
        <button
          onClick={handleClearAll}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
        >
          Clear All
        </button>
      </div>

      {/* Player History */}
      <div className="max-w-screen-lg mx-auto grid grid-cols-1 gap-4 px-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-white rounded-md shadow-md border border-gray-300"
          >
            <div className="flex flex-col">
              <span className="font-semibold">{item.quiz}</span>
              <span className="text-gray-600">Score: {item.score}</span>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTimes size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

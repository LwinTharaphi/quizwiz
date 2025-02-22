"use client";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa"; // For the cross icon

export default function PlayerHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerId, setPlayerId] = useState("");

  useEffect(() => {
    const playerId = localStorage.getItem("playerId");
    if (playerId) {
      setPlayerId(playerId);
    } else {
      console.error("Player ID not found in localStorage");
      setLoading(false);
      return;
    }

    const fetchPlayerHistory = async () => {
      try {
        const response = await fetch(`http://localhost:4000/player-history?player_id=${playerId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch player history");
        }
        const data = await response.json();
        console.log("Fetched Player History:", data); // Debugging
        setHistory(data);
      } catch (error) {
        console.error("Error fetching player history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerHistory();
  }, [playerId]);

  // Function to delete a single record
  const handleDelete = async (scoreId) => {
    console.log("Deleting record with score_id:", scoreId); // Debugging
    try {
      const response = await fetch(
        `http://localhost:4000/clear-single-record?score_id=${scoreId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        console.log("Record deleted successfully"); // Debugging
        setHistory(history.filter((item) => item.score_id !== scoreId));
      } else {
        console.error("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  // Function to delete all records for a player
  const handleClearAll = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/clear-all-records?player_id=${playerId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        // Clear the local state
        setHistory([]);
      } else {
        console.error("Failed to delete all records");
      }
    } catch (error) {
      console.error("Error clearing all records:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {/* Navbar */}
      <div className="flex justify-between items-center px-4 py-2 text-black">
        <div className="flex items-center space-x-4">
          <img src="/quiz.png" alt="Logo" className="h-12 ml-10" />
        </div>
        <div className="flex space-x-4 w-2/5 justify-end mr-20">
          <a href="/player/categories" className="hover:underline flex items-center justify-center">
            Home
          </a>
          <a href="/player/history" className="hover:underline border-2 border-blue-500 rounded-full px-4 py-2 transition-all duration-300 hover:bg-blue-100 flex items-center justify-center">
            History
          </a>
          <a href="/" className="hover:underline flex items-center justify-center">Logout</a>
        </div>
      </div>

      {/* Clear All Button */}
      {history.length > 0 && (
        <div className="max-w-screen-lg mx-auto flex justify-end mb-6 px-4">
          <button
            onClick={handleClearAll}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-500 text-xl">Loading player history...</div>
      )}

      {/* Player History */}
      {!loading && history.length === 0 ? (
        <div className="text-center text-gray-500 text-xl">No history found.</div>
      ) : (
        <div className="max-w-screen-lg mx-auto grid grid-cols-1 gap-4 px-4">
          {history.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-md shadow-md border border-gray-300"
            >
              <div className="flex flex-col">
                <span className="font-semibold">{item.quiz_title}</span>
                <span className="text-gray-600">Score: {item.total_score}</span>
                <span className="text-gray-500 text-sm">
                  Date: {new Date(item.score_date).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => handleDelete(item.score_id)} // Pass the correct score_id
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
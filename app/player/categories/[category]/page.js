"use client";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';

export default function Quizzes() {
  const router = useRouter();
  const { category } = useParams(); // Get category from dynamic route parameters
  const [quizzes, setQuizzes] = useState([]); // Initialize as an array
  const [search, setSearch] = useState(""); // State for search input

  useEffect(() => {
    // Fetch quizzes from the backend
    axios.get('http://localhost:5000/quizsets')
      .then((response) => {
        setQuizzes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching quizzes:', error);
      });
  }, []);

  const handleQuizClick = (id) => {
    router.push(`/player/quizzes/${category}/${id}`);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value); // Update search state
  };

  // Ensure that the quizzes are filtered by category_title and search term
  const filteredQuizzes = quizzes
    .filter((quiz) => quiz.category_title.toLowerCase() === category.toLowerCase()) // Matching category_title case-insensitively
    .filter((quiz) => quiz.quiz_title.toLowerCase().includes(search.toLowerCase())); // Filter by search term

  if (!category) {
    return <div>Loading...</div>;
  }

  if (filteredQuizzes.length === 0) {
    return <div>No quizzes found for this category.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">{category.toUpperCase()} Quizzes</h1>

      {/* Search Bar */}
      <div className="max-w-screen-lg mx-auto px-4 mt-6 flex justify-end">
        <input
          type="text"
          placeholder="Search by quiz name"
          value={search}
          onChange={handleSearchChange}
          className="w-2/5 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mt-6">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.quiz_title} // Use quiz_title as the unique key for rendering
            className="flex flex-col items-center justify-center w-64 h-64 rounded-lg shadow-md p-4 cursor-pointer transform hover:scale-105 transition-transform"
            style={{
              backgroundColor: "#F3F4F6", // pale color for the background
            }}
          >
            <h2 className="text-xl font-bold mb-4 text-center">{quiz.quiz_title}</h2>           
            <button
              onClick={() => handleQuizClick(quiz.quiz_id)}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Take Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

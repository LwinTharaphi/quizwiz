"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter for navigation
import axios from "axios";

const AnswersPage = () => {
  const pathname = usePathname(); // Get the current pathname
  const router = useRouter(); // Initialize router

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract category and quizSetId from the URL path
  const pathSegments = pathname?.split("/");
  const category = pathSegments?.[3];  // Extract category
  const quizSetId = pathSegments?.[4]; // Extract quizSetId

  // Fetch questions based on quiz_id from URL
  useEffect(() => {
    if (!quizSetId) return; // If quizSetId is not available yet, do nothing

    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/questions?quiz_id=${quizSetId}`);
        setQuestions(response.data);
      } catch (err) {
        setError(err.message || "Error fetching questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizSetId]);

  // Handle Back Button Click
  const handleBackToSubmission = () => {
    router.push(`/player/quizzes/${category}/${quizSetId}/submission`);
  };

  // If data is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-screen-lg mx-auto text-left">
          <h1 className="text-4xl font-bold text-green-600 mb-8">Loading...</h1>
        </div>
      </div>
    );
  }

  // If an error occurs
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-screen-lg mx-auto text-left">
          <h1 className="text-4xl font-bold text-red-600 mb-8">Error: {error}</h1>
        </div>
      </div>
    );
  }

  // Render the questions and answers
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-screen-lg mx-auto text-left">
        {/* Title */}
        <h1 className="text-4xl font-bold text-green-600 mb-8">Answers</h1>

        {/* Questions and Answers */}
        <div className="space-y-6">
          {questions.map((item, index) => (
            <div key={item.question_id} className="border-2 border-gray-300 p-4 rounded-md">
              <p className="text-xl font-semibold mb-2">
                <strong>Question {index + 1}:</strong> {item.question_text}
              </p>
              <p className="text-lg font-medium">
                <strong>Answer:</strong> {item.correct_ans}
              </p>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={handleBackToSubmission}
            className="bg-gray-500 text-white px-6 py-3 rounded-md shadow-lg hover:bg-gray-600 transition-colors duration-300"
          >
            Back to Submission
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswersPage;
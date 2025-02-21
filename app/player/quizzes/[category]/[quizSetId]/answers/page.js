"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";  // Use usePathname from next/navigation
import axios from "axios";

const AnswersPage = () => {
  const pathname = usePathname();  // Get the current pathname
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract quiz_id from the URL path
  const quiz_id = pathname?.split('/')[4];  // Assuming the path is /player/quizzes/category/[quiz_id]/answers

  // Fetch questions based on quiz_id from URL
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!quiz_id) return;  // If quiz_id is not available yet, do nothing

      try {
        const response = await axios.get(`http://localhost:4000/questions?quiz_id=${quiz_id}`);
        setQuestions(response.data);
      } catch (err) {
        setError(err.message || "Error fetching questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quiz_id]);

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
      </div>
    </div>
  );
};

export default AnswersPage;

"use client";
import React from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation"; // To access the query params

const SubmissionPage = () => {
  const { category, quizSetId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const score = searchParams.get("score");
  const totalQuestions = searchParams.get("totalQuestions");

  const handleSeeAnswers = () => {
    // Logic for seeing the answers
    router.push(`/player/quizzes/category/${quizSetId}/answers`);
  };

  const handleRetakeQuiz = () => {
    // Logic for retaking the quiz
    router.push(`/player/quizzes/${category}/${quizSetId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-screen-lg mx-auto text-center">
        {/* Green Circle Mark */}
        <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white text-4xl mb-6">
          ✔
        </div>

        {/* Congratulations Text */}
        <h1 className="text-4xl font-bold text-green-600 mb-6">Congratulations!</h1>

        {/* Completion Message */}
        <p className="text-xl mb-4">
          You have completed one of our quiz sets.
        </p>

        {/* Score Message */}
        <p className="text-xl mb-6">
          Your score is {score} out of {totalQuestions}.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSeeAnswers}
            className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-600 transition-colors duration-300"
          >
            See Answers
          </button>
          <button
            onClick={handleRetakeQuiz}
            className="bg-gray-500 text-white px-6 py-3 rounded-md shadow-lg hover:bg-gray-600 transition-colors duration-300"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionPage;

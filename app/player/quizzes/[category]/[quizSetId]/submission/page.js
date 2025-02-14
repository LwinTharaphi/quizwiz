"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";

const SubmissionPage = () => {
  const { category, quizSetId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const score = searchParams.get("score");
  const totalQuestions = searchParams.get("totalQuestions");
  const [playerId, setPlayerId] = useState("");
  const quizId = Number(quizSetId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // To store response messages
  const hasSubmitted = useRef(false); // Track if the score has been submitted

  useEffect(() => {
    const playerId = localStorage.getItem("playerId");
    if (playerId) {
      setPlayerId(playerId);
    } else {
      console.error("Player ID not found in localStorage");
      setLoading(false);
      return;
    }
    if (score !== null && playerId && quizId && !hasSubmitted.current) {
      hasSubmitted.current = true; // Mark as submitted to prevent duplicates

      const submitOrUpdateScore = async () => {
        setIsSubmitting(true);
        try {
          const requestData = {
            totalScore: Number(score), // Convert score to a number
            quizId,
            playerId,
          };

          console.log("Submitting or updating score with data:", requestData);

          // First, check if a record already exists for this player and quiz
          const checkResponse = await fetch(
            `http://localhost:5000/check-score?playerId=${playerId}&quizId=${quizId}`
          );

          if (!checkResponse.ok) {
            throw new Error("Failed to check existing score record.");
          }

          const checkData = await checkResponse.json();
          const recordExists = checkData.exists;

          // If a record exists, update it; otherwise, create a new one
          const endpoint = recordExists ? "/update-score" : "/save-score";
          const method = recordExists ? "PUT" : "POST";

          const scoreResponse = await fetch(`http://localhost:5000${endpoint}`, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
          });

          if (!scoreResponse.ok) {
            const errorResponse = await scoreResponse.json();
            throw new Error(errorResponse.message || "Failed to process score.");
          }

          const responseData = await scoreResponse.json();
          console.log("Score processed successfully:", responseData);
          setSubmissionStatus(responseData.message); // Update UI with the success message
        } catch (error) {
          console.error("Error processing score:", error);
          setSubmissionStatus("Failed to process score. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      };

      submitOrUpdateScore();
    }
  }, [playerId, quizId, score]);

  const handleSeeAnswers = () => {
    router.push(`/player/quizzes/category/${quizId}/answers`);
  };

  const handleRetakeQuiz = () => {
    router.push(`/player/quizzes/${category}/${quizId}`);
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

        {/* Submission Status */}
        {submissionStatus && (
          <p className={`text-lg mb-4 ${isSubmitting ? "text-gray-500" : "text-green-500"}`}>
            {submissionStatus}
          </p>
        )}

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

        {/* If submitting */}
        {isSubmitting && (
          <div className="mt-4 text-lg text-gray-500">Processing your score...</div>
        )}
      </div>
    </div>
  );
};

export default SubmissionPage;
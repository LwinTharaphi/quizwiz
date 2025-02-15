"use client"
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const paleColors = [
  "#FDE2E4", "#E2F0CB", "#D7E3FC", "#FCE1E4", "#FFF4E6",
  "#E9F5DB", "#E2ECF5", "#FBE4E6", "#E8F4F8", "#FAF3E3",
];

const QuizSetPage = () => {
  const { category, quizSetId } = useParams();
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questionTime, setQuestionTime] = useState(0); // Initialize to 0
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [quizTitle, setQuizTitle] = useState("");

  useEffect(() => {
    if (!quizSetId || isNaN(quizSetId)) {
      console.error("Invalid quizSetId:", quizSetId);
      alert("Invalid quiz ID. Please try again.");
      return;
    }

    // Fetch quiz set data to get allowed_time and quiz title
    axios.get(`http://localhost:5000/quizsets`)
      .then((response) => {
        const quizSet = response.data.find(quiz => quiz.quiz_id === parseInt(quizSetId));
        if (quizSet) {
          setQuizTitle(quizSet.quiz_title); // Set the quiz title
          const allowedTime = parseInt(quizSet.allowed_time, 10); // Parse allowed_time as an integer
          setQuestionTime(allowedTime); // Set the question time
          setTotalTimeLeft(allowedTime); // Set the total quiz time
        } else {
          alert("Quiz set not found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching quiz set data:", error);
        alert("Failed to load quiz set data. Please try again later.");
      });

    // Fetch questions for the quiz set
    axios.get(`http://localhost:5000/questions?quiz_id=${Number(quizSetId)}`)
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        alert("Failed to load questions. Please try again later.");
      });
  }, [quizSetId]);

  useEffect(() => {
    if (questionTime === 0) {
      handleNextClick();
    }
    const questionTimer = setInterval(() => {
      setQuestionTime((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(questionTimer);
  }, [questionTime, currentQuestionIndex]);

  useEffect(() => {
    if (totalTimeLeft === 0 && questions.length > 0) {
      handleSubmit();
    }
    const totalTimer = setInterval(() => {
      setTotalTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(totalTimer);
  }, [totalTimeLeft, questions.length]);

  const handleAnswerClick = (questionIndex, option) => {
    setSelectedAnswers((prevState) => ({
      ...prevState,
      [questionIndex]: option,
    }));
  };

  const handleNextClick = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionTime(totalTimeLeft); // Reset timer for next question using totalTimeLeft
    }
  };

  const handlePreviousClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setQuestionTime(totalTimeLeft); // Reset timer for previous question using totalTimeLeft
    }
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach((question, idx) => {
      if (selectedAnswers[idx] === question.correct_ans) {
        score++;
      }
    });

    router.push(`/player/quizzes/category/${quizSetId}/submission?score=${score}&totalQuestions=${questions.length}`);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (questions.length === 0) return <p className="text-center mt-10">Loading questions...</p>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">{`${quizTitle} - ${category} Quiz`}</h1>

      <div className="max-w-screen-lg mx-auto relative p-6 bg-white shadow-lg rounded-lg">
        {/* Timer at Top Right */}
        <div className="absolute top-4 right-4 text-lg font-semibold text-red-500">
          ⏳ {formatTime(totalTimeLeft)}
        </div>

        {/* Question Number at Left */}
        <div className="absolute top-4 left-4 text-lg font-semibold text-gray-600">
          Question {currentQuestionIndex + 1}/{questions.length}
        </div>

        {/* Question Text */}
        <p className="text-xl font-semibold text-center mb-4">{currentQuestion.question_text}</p>

        {/* Answer Options */}
        <div className="container mx-auto grid grid-cols-2 gap-4">
          {[currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4].map((option, idx) => (
            <div
              key={idx}
              className={`p-4 border rounded-md cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-200 
                ${selectedAnswers[currentQuestionIndex] === option ? "bg-blue-100 border-blue-500" : ""}`}
              style={{
                backgroundColor: paleColors[idx % paleColors.length],
                width: "350px",
                height: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "10px auto",
              }}
              onClick={() => handleAnswerClick(currentQuestionIndex, option)}
            >
              {option}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePreviousClick}
            className="bg-gray-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleNextClick}
              className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizSetPage;
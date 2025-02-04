"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; 

const questions = [
  { id: 1, question: "What does HTML stand for?", options: ["HyperText Markup Language", "Hyper Tool Markup Language", "Home Tool Markup Language", "HyperText Multi Language"], correctAnswer: "HyperText Markup Language" },
  { id: 2, question: "What is the purpose of CSS?", options: ["Styling", "Functionality", "Structure", "Interaction"], correctAnswer: "Styling" },
  { id: 3, question: "What does JavaScript do?", options: ["Manipulates the DOM", "Serves as a database", "Styles the page", "Handles user input"], correctAnswer: "Manipulates the DOM" },
  { id: 4, question: "What does HTTP stand for?", options: ["HyperText Transfer Protocol", "HyperTool Transfer Protocol", "Hyper Transfer Text Protocol", "HyperText Translation Protocol"], correctAnswer: "HyperText Transfer Protocol" },
  { id: 5, question: "What is the purpose of a database?", options: ["Store data", "Execute code", "Create websites", "Design graphics"], correctAnswer: "Store data" },
  { id: 6, question: "Which of the following is a JavaScript framework?", options: ["React", "Django", "Spring", "Laravel"], correctAnswer: "React" },
  { id: 7, question: "Which tag is used to link an external CSS file?", options: ["<link>", "<style>", "<script>", "<css>"], correctAnswer: "<link>" },
  { id: 8, question: "Which language is used to structure web pages?", options: ["HTML", "CSS", "JavaScript", "Python"], correctAnswer: "HTML" },
  { id: 9, question: "Which of the following is used to style a webpage?", options: ["CSS", "HTML", "JavaScript", "PHP"], correctAnswer: "CSS" },
  { id: 10, question: "What is the purpose of the 'console.log' method in JavaScript?", options: ["Output data to the console", "Print data to the screen", "Store data in a file", "Create an alert"], correctAnswer: "Output data to the console" },
];
const totalTime = questions.length * 45;

const paleColors = [
  "#FDE2E4", "#E2F0CB", "#D7E3FC", "#FCE1E4", "#FFF4E6",
  "#E9F5DB", "#E2ECF5", "#FBE4E6", "#E8F4F8", "#FAF3E3",
];

const QuizSetPage = () => {
  const { category, quizSetId } = useParams();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questionTime, setQuestionTime] = useState(45);
  const [totalTimeLeft, setTotalTimeLeft] = useState(totalTime); // 90 seconds timer

  useEffect(() => {
    if (questionTime === 0) {
      handleNextClick();
    }
    const questionTimer = setInterval(() => {
      setQuestionTime((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(questionTimer);
  }, [questionTime]);

  useEffect(() => {
    if (totalTimeLeft === 0) {
      handleSubmit();
    }
    const totalTimer = setInterval(() => {
      setTotalTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(totalTimer);
  }, [totalTimeLeft]);

  const handleAnswerClick = (questionIndex, option) => {
    setSelectedAnswers((prevState) => ({
      ...prevState,
      [questionIndex]: option,
    }));
  };

  const handleNextClick = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const score = Object.values(selectedAnswers).filter((answer, idx) => answer === questions[idx].correctAnswer).length;
    router.push(`/player/quizzes/category/${quizSetId}/submission?score=${score}&totalQuestions=${questions.length}`);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">{`Quiz Set ${quizSetId} - ${category} Quiz`}</h1>

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
        <p className="text-xl font-semibold text-center mb-4">{currentQuestion.question}</p>

        {/* Answer Options */}
        <div className="container mx-auto grid grid-cols-2 gap-4">
          {currentQuestion.options.map((option, idx) => (
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

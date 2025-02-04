"use client";
import React from "react";

// Sample questions constant
const questions = [
  { question: "What does HTML stand for?", options: ["HyperText Markup Language", "Hyper Tool Markup Language", "Home Tool Markup Language", "HyperText Multi Language"], correctAnswer: "HyperText Markup Language" },
  { question: "What is the purpose of CSS?", options: ["Styling", "Functionality", "Structure", "Interaction"], correctAnswer: "Styling" },
  { question: "What does JavaScript do?", options: ["Manipulates the DOM", "Serves as a database", "Styles the page", "Handles user input"], correctAnswer: "Manipulates the DOM" },
  { question: "What does HTTP stand for?", options: ["HyperText Transfer Protocol", "HyperTool Transfer Protocol", "Hyper Transfer Text Protocol", "HyperText Translation Protocol"], correctAnswer: "HyperText Transfer Protocol" },
  { question: "What is the purpose of a database?", options: ["Store data", "Execute code", "Create websites", "Design graphics"], correctAnswer: "Store data" },
  { question: "Which of the following is a JavaScript framework?", options: ["React", "Django", "Spring", "Laravel"], correctAnswer: "React" },
  { question: "Which tag is used to link an external CSS file?", options: ["<link>", "<style>", "<script>", "<css>"], correctAnswer: "<link>" },
  { question: "Which language is used to structure web pages?", options: ["HTML", "CSS", "JavaScript", "Python"], correctAnswer: "HTML" },
  { question: "Which of the following is used to style a webpage?", options: ["CSS", "HTML", "JavaScript", "PHP"], correctAnswer: "CSS" },
  { question: "What is the purpose of the 'console.log' method in JavaScript?", options: ["Output data to the console", "Print data to the screen", "Store data in a file", "Create an alert"], correctAnswer: "Output data to the console" },
];

const AnswersPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-screen-lg mx-auto text-left">
        {/* Title */}
        <h1 className="text-4xl font-bold text-green-600 mb-8">Answers</h1>

        {/* Questions and Answers */}
        <div className="space-y-6">
          {questions.map((item, index) => (
            <div key={index} className="border-2 border-gray-300 p-4 rounded-md">
              <p className="text-xl font-semibold mb-2">Question {index + 1}: {item.question}</p>
              <p className="text-lg font-medium">Answer: {item.correctAnswer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnswersPage;

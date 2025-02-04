"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';

const technologyQuizzes = [
  { id: 1, title: "HTML Quiz", description: "Test your knowledge on the latest version of HTML." },
  { id: 2, title: "Internet of Things (IoT) Quiz", description: "Learn and test your understanding of IoT." },
  { id: 3, title: "Cloud Computing Quiz", description: "Explore the concepts and benefits of cloud computing." },
  { id: 4, title: "Artificial Intelligence (AI) Quiz", description: "Test your knowledge of AI and its applications." },
  { id: 5, title: "Blockchain Quiz", description: "Learn about the technology behind blockchain and cryptocurrencies." },
  { id: 6, title: "5G vs 4G Quiz", description: "Test your knowledge of mobile network technologies." },
  { id: 7, title: "Data Breach Quiz", description: "Learn how to prevent and respond to data breaches." },
  { id: 8, title: "Cybersecurity Quiz", description: "Test your knowledge on protecting digital assets." },
  { id: 9, title: "Software Development Quiz", description: "Learn about the life of a software developer." },
  { id: 10, title: "Machine Learning Quiz", description: "Test your understanding of machine learning concepts." },
  { id: 11, title: "Smart Home Quiz", description: "Test your knowledge of smart home technologies." },
  { id: 12, title: "Quantum Computing Quiz", description: "Explore the world of quantum computing." },
  { id: 13, title: "Virtual Reality (VR) Quiz", description: "Learn about VR and its applications in technology." },
  { id: 14, title: "Augmented Reality (AR) Quiz", description: "Test your knowledge of AR and its real-world applications." },
  { id: 15, title: "Cloud Storage Quiz", description: "Learn about the technology behind cloud storage." },
  { id: 16, title: "Data Center Quiz", description: "Test your knowledge of data centers and their operations." },
  { id: 17, title: "Software Frameworks Quiz", description: "Learn about the most popular software frameworks." },
  { id: 18, title: "Mobile Apps Quiz", description: "Test your knowledge of mobile application development." },
  { id: 19, title: "Big Data Quiz", description: "Explore the world of big data and its analysis." },
  { id: 20, title: "Database Quiz", description: "Test your knowledge of databases and their management." },
];

export default function TechnologyQuizzes() {
  const router = useRouter();
  const { category } = useParams(); // Get category from dynamic route parameters
  const [search, setSearch] = useState(""); // State for search input

  const handleQuizClick = (id) => {
    if (category) {
      router.push(`/player/quizzes/${category}/${id}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value); // Update search state
  };

  const filteredQuizzes = technologyQuizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!category) {
    return <div>Loading...</div>;
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
            key={quiz.id}
            className="flex flex-col items-center justify-center w-64 h-64 rounded-lg shadow-md p-4 cursor-pointer transform hover:scale-105 transition-transform"
            style={{
              backgroundColor: "#F3F4F6", // pale color for the background
            }}
          >
            <h2 className="text-xl font-bold mb-4 text-center">{quiz.title}</h2>
            <p className="text-gray-700 text-center mb-4">{quiz.description}</p>
            <button
              onClick={() => handleQuizClick(quiz.id)}
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

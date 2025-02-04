"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const quizData = [
  { id: 1, title: "World History Trivia", creator: "John Smith", category: "History", questions: 15, submitted: "2023-10-15" },
  { id: 2, title: "Science Quiz Basics", creator: "Sarah Johnson", category: "Science", questions: 20, submitted: "2023-10-14" },
  { id: 3, title: "Math Challenge", creator: "Mike Wilson", category: "Mathematics", questions: 12, submitted: "2023-10-14" },
  { id: 4, title: "Geography Master", creator: "Emma Davis", category: "Geography", questions: 18, submitted: "2023-10-13" },
  { id: 5, title: "Literature Quiz", creator: "David Brown", category: "Literature", questions: 25, submitted: "2023-10-13" },
  { id: 6, title: "Physics Challenge", creator: "Lisa Anderson", category: "Science", questions: 16, submitted: "2023-10-12" },
  { id: 7, title: "Music Theory Basics", creator: "Robert Taylor", category: "Arts", questions: 22, submitted: "2023-10-12" },
  { id: 8, title: "Chemistry Fundamentals", creator: "Patricia White", category: "Science", questions: 18, submitted: "2023-10-11" },
  { id: 9, title: "Sports Trivia", creator: "James Wilson", category: "Sports", questions: 30, submitted: "2023-10-11" },
  { id: 10, title: "Computer Science Basics", creator: "Mary Johnson", category: "Technology", questions: 20, submitted: "2023-10-10" },
  { id: 11, title: "General Knowledge Quiz", creator: "Alice Green", category: "General", questions: 15, submitted: "2023-10-09" },
  { id: 12, title: "Biology Basics", creator: "Chris Adams", category: "Biology", questions: 20, submitted: "2023-10-09" },
  { id: 13, title: "Astronomy Quiz", creator: "Laura Grey", category: "Astronomy", questions: 12, submitted: "2023-10-08" },
  { id: 14, title: "Art and Design", creator: "Mark Black", category: "Arts", questions: 18, submitted: "2023-10-08" },
  { id: 15, title: "Programming Basics", creator: "Rachel White", category: "Programming", questions: 25, submitted: "2023-10-07" },
  { id: 16, title: "Environmental Science", creator: "Steven Brown", category: "Science", questions: 16, submitted: "2023-10-07" },
  { id: 17, title: "Physics Advanced", creator: "Nancy Drew", category: "Physics", questions: 22, submitted: "2023-10-06" },
  { id: 18, title: "World Capitals", creator: "Sophia Hill", category: "Geography", questions: 18, submitted: "2023-10-06" },
  { id: 19, title: "History of Technology", creator: "Gregory Brown", category: "History", questions: 30, submitted: "2023-10-05" },
  { id: 20, title: "Chemistry Reactions", creator: "Anna Taylor", category: "Chemistry", questions: 20, submitted: "2023-10-05" },
  { id: 21, title: "Sports Techniques", creator: "William Harris", category: "Sports", questions: 15, submitted: "2023-10-04" },
  { id: 22, title: "Geological Wonders", creator: "Emily Carter", category: "Geography", questions: 20, submitted: "2023-10-04" },
  { id: 23, title: "Shakespeare Quiz", creator: "Charlotte King", category: "Literature", questions: 12, submitted: "2023-10-03" },
  { id: 24, title: "Physics Theories", creator: "Ethan Scott", category: "Science", questions: 18, submitted: "2023-10-03" },
  { id: 25, title: "Fine Arts", creator: "Victoria Baker", category: "Arts", questions: 25, submitted: "2023-10-02" },
  { id: 26, title: "Coding Challenges", creator: "Oliver White", category: "Programming", questions: 16, submitted: "2023-10-02" },
  { id: 27, title: "Space Exploration", creator: "Liam Green", category: "Astronomy", questions: 22, submitted: "2023-10-01" },
  { id: 28, title: "Math Puzzles", creator: "Isabella Moore", category: "Mathematics", questions: 18, submitted: "2023-10-01" },
  { id: 29, title: "World War II", creator: "Mason Lee", category: "History", questions: 30, submitted: "2023-09-30" },
  { id: 30, title: "Robotics Basics", creator: "Harper Young", category: "Technology", questions: 20, submitted: "2023-09-30" },
];

const QuizReviewPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page
  };

  const filteredQuizzes = quizData.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm) ||
      quiz.creator.toLowerCase().includes(searchTerm) ||
      quiz.category.toLowerCase().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Quiz Reviews</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search quizzes..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Quiz Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Quiz Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Creator
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Questions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginatedQuizzes.map((quiz) => (
              <motion.tr
                key={quiz.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {quiz.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {quiz.creator}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {quiz.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {quiz.questions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {quiz.submitted}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button className="text-green-400 hover:text-green-300 mr-2">Approve</button>
                  <button className="text-red-400 hover:text-red-300">Reject</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-400">
          Showing {itemsPerPage * (currentPage - 1) + 1}-
          {Math.min(itemsPerPage * currentPage, filteredQuizzes.length)} of {filteredQuizzes.length} quizzes
        </span>
        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-lg ${
              currentPage === 1
                ? "text-gray-500 cursor-not-allowed"
                : "text-blue-400 hover:bg-gray-700"
            }`}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`px-3 py-1 text-sm rounded-lg ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={`px-3 py-1 text-sm rounded-lg ${
              currentPage === totalPages
                ? "text-gray-500 cursor-not-allowed"
                : "text-blue-400 hover:bg-gray-700"
            }`}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizReviewPage;

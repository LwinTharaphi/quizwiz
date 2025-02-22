"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "axios";

const QuizReviewPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzes, setQuizzes] = useState([]);
  const itemsPerPage = 10;

  // For "View" (Review) Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Full quiz details

  // Fetch quizzes pending review
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:4000/review_quiz");
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };
    fetchQuizzes();
  }, []);

  // Search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.quiz_title.toLowerCase().includes(searchTerm) ||
    quiz.username.toLowerCase().includes(searchTerm) ||
    quiz.category_title.toLowerCase().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Approve
  const approveQuiz = async (quizId) => {
    try {
      await axios.put(`http://localhost:4000/approve_quiz?quizId=${quizId}&status=approved`);
      setQuizzes((prev) =>
        prev.map((quiz) => (quiz.quiz_id === quizId ? { ...quiz, isapproved: "approved" } : quiz))
      );
    } catch (error) {
      console.error("Error approving quiz:", error);
    }
  };

  // Reject
  const rejectQuiz = async (quizId) => {
    try {
      await axios.put(`http://localhost:4000/approve_quiz?quizId=${quizId}&status=rejected`);
      setQuizzes((prev) =>
        prev.map((quiz) => (quiz.quiz_id === quizId ? { ...quiz, isapproved: "rejected" } : quiz))
      );
    } catch (error) {
      console.error("Error rejecting quiz:", error);
    }
  };

  // View full quiz details in a read-only modal
  const viewQuizDetails = async (quizId) => {
    try {
      const response = await axios.get(`http://localhost:4000/quiz_details?quizId=${quizId}`);
      setSelectedQuiz(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching full quiz details:", error);
      alert("Failed to load quiz details. Check the console for more info.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header + Search */}
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

      {/* Table of Quizzes */}
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
                Approval Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginatedQuizzes.map((quiz) => (
              <motion.tr
                key={quiz.quiz_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{quiz.quiz_title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{quiz.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{quiz.category_title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{quiz.number_of_questions}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(quiz.submitted_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{quiz.isapproved}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    onClick={() => viewQuizDetails(quiz.quiz_id)}
                    className="text-blue-400 hover:text-blue-300 mr-2"
                  >
                    View
                  </button>
                  <button
                    className="text-green-400 hover:text-green-300 mr-2"
                    onClick={() => approveQuiz(quiz.quiz_id)}
                  >
                    Approve
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => rejectQuiz(quiz.quiz_id)}
                  >
                    Reject
                  </button>
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
              currentPage === 1 ? "text-gray-500 cursor-not-allowed" : "text-blue-400 hover:bg-gray-700"
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
                currentPage === index + 1 ? "bg-blue-500 text-white" : "text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={`px-3 py-1 text-sm rounded-lg ${
              currentPage === totalPages ? "text-gray-500 cursor-not-allowed" : "text-blue-400 hover:bg-gray-700"
            }`}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Review Modal (Read-Only) */}
      {isModalOpen && selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-2/3 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-black">Quiz Review Details</h3>
            <p className="mb-2">
              <strong>Title:</strong> {selectedQuiz.quiz_title}
            </p>
            <p className="mb-2">
              <strong>Creator:</strong> {selectedQuiz.username}
            </p>
            <p className="mb-2">
              <strong>Category:</strong> {selectedQuiz.category_title}
            </p>
            <p className="mb-2">
              <strong>Submitted Date:</strong>{" "}
              {new Date(selectedQuiz.submitted_date).toLocaleDateString()}
            </p>
            <p className="mb-4">
              <strong>Approval Status:</strong> {selectedQuiz.isapproved}
            </p>

            <h4 className="text-lg font-semibold text-black mb-3">Questions:</h4>
            {selectedQuiz.questions && selectedQuiz.questions.length > 0 ? (
              <ul className="space-y-4">
                {selectedQuiz.questions.map((q) => (
                  <li
                    key={q.question_id}
                    className="border border-gray-300 p-3 rounded-md bg-gray-100 text-black"
                  >
                    <p className="font-semibold mb-2">{q.question_text}</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>
                        <strong>A:</strong> {q.option1}
                      </li>
                      <li>
                        <strong>B:</strong> {q.option2}
                      </li>
                      <li>
                        <strong>C:</strong> {q.option3}
                      </li>
                      <li>
                        <strong>D:</strong> {q.option4}
                      </li>
                    </ul>
                    <p className="mt-2 text-green-600">
                      Correct Answer: {q.correct_ans}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No questions found.</p>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default QuizReviewPage;
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "axios"; 

const QuizReviewPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzes, setQuizzes] = useState([]);
  const itemsPerPage = 10;

  // Fetch data from the API
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page on search
  };

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.quiz_title.toLowerCase().includes(searchTerm) ||
      quiz.username.toLowerCase().includes(searchTerm) ||
      quiz.category_title.toLowerCase().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle approval
  const approveQuiz = async (quizId) => {
    try {
      await axios.put(`http://localhost:4000/approve_quiz?quizId=${quizId}&status=approved`);
      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) =>
          quiz.quiz_id === quizId ? { ...quiz, isapproved: 'approved' } : quiz
        )
      );
    } catch (error) {
      console.error("Error approving quiz:", error);
    }
  };
  

  // Handle rejection (does not change isapproved value)
  const rejectQuiz = async (quizId) => {
    try {
      await axios.put(`http://localhost:5000/approve_quiz?quizId=${quizId}&status=rejected`);
      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) =>
          quiz.quiz_id === quizId ? { ...quiz, isapproved: 'rejected' } : quiz
        )
      );
    } catch (error) {
      console.error("Error rejecting quiz:", error);
    }
  };

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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {quiz.quiz_title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {quiz.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {quiz.category_title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {quiz.number_of_questions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(quiz.submitted_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {quiz.isapproved}
                </td>               
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
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
          {Math.min(itemsPerPage * currentPage, filteredQuizzes.length)} of{" "}
          {filteredQuizzes.length} quizzes
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

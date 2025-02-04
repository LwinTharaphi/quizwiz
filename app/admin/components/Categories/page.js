import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const initialCategories = [
  { id: 1, name: "Science", description: "General science topics including physics, chemistry, and biology", quizzes: 15 },
  { id: 2, name: "Technology", description: "Modern technology, computers, and programming", quizzes: 12 },
  { id: 3, name: "History", description: "World history and important historical events", quizzes: 8 },
  { id: 4, name: "Mathematics", description: "Various mathematical concepts and problem solving", quizzes: 10 },
  { id: 5, name: "Literature", description: "Classic and modern literature questions", quizzes: 6 },
  { id: 6, name: "Geography", description: "World geography and map knowledge", quizzes: 9 },
  { id: 7, name: "Sports", description: "Various sports and athletic competitions", quizzes: 7 },
  { id: 8, name: "Music", description: "Musical knowledge and theory", quizzes: 5 },
  { id: 9, name: "Art", description: "Art history and famous artists", quizzes: 4 },
  { id: 10, name: "Movies", description: "Cinema and film industry knowledge", quizzes: 11 },
  { id: 11, name: "Physics", description: "Concepts of physics and problem-solving", quizzes: 14 },
  { id: 12, name: "Chemistry", description: "Chemical reactions and periodic table knowledge", quizzes: 16 },
  { id: 13, name: "Biology", description: "Study of living organisms and ecosystems", quizzes: 9 },
  { id: 14, name: "Programming", description: "Introduction to programming and algorithms", quizzes: 13 },
  { id: 15, name: "Astronomy", description: "Exploring stars, planets, and galaxies", quizzes: 6 },
  { id: 16, name: "Economics", description: "Basic economics and market principles", quizzes: 8 },
  { id: 17, name: "Psychology", description: "Understanding human behavior and mind", quizzes: 7 },
  { id: 18, name: "Philosophy", description: "Philosophical questions and theories", quizzes: 5 },
  { id: 19, name: "Health", description: "Health and wellness knowledge", quizzes: 10 },
  { id: 20, name: "Education", description: "Education theories and practices", quizzes: 12 },
];

const Categories = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm) ||
      category.description.toLowerCase().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddCategory = () => {
    const newId = categories.length + 1;
    setCategories([...categories, { id: newId, ...newCategory, quizzes: 0 }]);
    setNewCategory({ name: "", description: "" });
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
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
        <h2 className="text-xl font-semibold text-gray-100">Category</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add New Category
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search categories..."
          className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quizzes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginatedCategories.map((category) => (
              <motion.tr
                key={category.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{category.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{category.quizzes}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button className="text-blue-400 hover:text-blue-300 mr-2">Edit</button>
                  <button className="text-red-400 hover:text-red-300">Delete</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-400">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, filteredCategories.length)} of {filteredCategories.length} entries
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-1/3">
            <h3 className="text-xl font-semibold mb-4 text-black">Create New Category</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name:</label>
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
              <input
                type="text"
                name="description"
                value={newCategory.description}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={handleAddCategory}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Categories;

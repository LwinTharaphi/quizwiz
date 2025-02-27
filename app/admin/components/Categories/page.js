"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch categories from backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get("http://localhost:4000/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.category_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle Add or Update Category
  const handleSaveCategory = () => {
    if (!newCategory.name || !newCategory.description) return;

    if (isEditMode && selectedCategory) {
      // Update existing category
      axios
        .put(`http://localhost:4000/categories/${selectedCategory.category_id}`, {
          category_title: newCategory.name,
          description: newCategory.description,
        })
        .then((response) => {
          setCategories(
            categories.map((cat) =>
              cat.category_id === selectedCategory.category_id ? response.data : cat
            )
          );
          closeModal();
        })
        .catch((error) => console.error("Error updating category:", error));
    } else {
      // Create new category
      axios
        .post("http://localhost:4000/categories", {
          category_title: newCategory.name,
          description: newCategory.description,
        })
        .then((response) => {
          setCategories([...categories, response.data]);
          closeModal();
        })
        .catch((error) => console.error("Error adding category:", error));
    }
  };

  // Handle Delete
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:4000/categories/${id}`)
      .then(() => {
        setCategories(categories.filter((cat) => cat.category_id !== id));
      })
      .catch((error) => console.error("Error deleting category:", error));
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setNewCategory({ name: category.category_title, description: category.description });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedCategory(null);
    setNewCategory({ name: "", description: "" });
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
          onClick={() => {
            setIsModalOpen(true);
            setIsEditMode(false);
            setNewCategory({ name: "", description: "" });
          }}
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
                key={category.category_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{category.category_title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{category.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{category.quiz_count || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    onClick={() => openEditModal(category)}
                    className="text-blue-400 hover:text-blue-300 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.category_id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
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
            <h3 className="text-xl font-semibold mb-4 text-black">
              {isEditMode ? "Edit Category" : "Create New Category"}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name:
              </label>
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description:
              </label>
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
                onClick={handleSaveCategory}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                {isEditMode ? "Update" : "Create"}
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Categories;
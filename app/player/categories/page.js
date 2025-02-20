"use client";
import React, { useEffect ,useState } from "react";
import axios from 'axios';
import { useRouter } from "next/navigation";

const paleColors = [
  "#FDE2E4", "#E2F0CB", "#D7E3FC", "#FCE1E4", "#FFF4E6",
  "#E9F5DB", "#E2ECF5", "#FBE4E6", "#E8F4F8", "#FAF3E3",
  "#F3E8E9", "#E4F0E2", "#FDF6EC", "#E2E6F0", "#FBE3E4",
  "#F4F9F9", "#EDEEF0", "#FFF8E7", "#F4F1E4", "#EFF5E9",
];

export default function Categories() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from the backend
    axios.get('http://localhost:4000/categories')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const handleCardClick = (category_title) => {
    router.push(`/player/categories/${category_title.toLowerCase()}`);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value.toLowerCase());
  };

  const filteredCategories = categories.filter((category) =>
    category.category_title.toLowerCase().includes(search)
  );

  return (
    <div className="min-h-screen py-10">
      {/* Navbar */}
      <div className="flex justify-between items-center px-4 py-2 text-black">
        <div className="flex items-center space-x-4">
          <img src="/quiz.png" alt="Logo" className="h-12 ml-10" />
        </div>
        <div className="flex space-x-4 w-2/5 justify-end mr-20">
          <a
            href="/player/categories"
            className="hover:underline border-2 border-blue-500 rounded-full px-4 py-2 transition-all duration-300 hover:bg-blue-100 flex items-center justify-center"
          >
            Home
          </a>
          <a href="/player/player-history" className="hover:underline flex items-center justify-center">History</a>
          <a href="/" className="hover:underline flex items-center justify-center">Logout</a>
        </div>
      </div>



      {/* Search Bar */}
      <div className="max-w-screen-lg mx-auto px-4 mt-6 flex justify-end">
        <input
          type="text"
          placeholder="Search by category"
          value={search}
          onChange={handleSearchChange}
          className="w-2/5 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Categories */}
      <h1 className="text-3xl font-bold text-center mb-6">Categories</h1>
      <div className="max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {filteredCategories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(category.category_title)}
            className="flex flex-col items-center justify-center w-63 h-60 rounded-lg shadow-md p-3 cursor-pointer transform hover:scale-105 transition-transform"
            style={{
              backgroundColor: paleColors[index % paleColors.length],
            }}
          >
            <h2 className="text-xl font-bold mb-4 text-center">{category.category_title}</h2>
            <p className="text-gray-700 text-center">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

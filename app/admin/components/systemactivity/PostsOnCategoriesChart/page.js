"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]; // Category colors

const PostsOnCategoriesChart = () => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/admin/stats")
      .then((res) => res.json())
      .then((stats) => {
        setCategoryData(
          stats.categoryStats.map((category, index) => ({
            name: category.category_title,
            value: parseInt(category.count, 10),
            color: COLORS[index % COLORS.length],
          }))
        );
      })
      .catch((err) => console.error("Error fetching category stats:", err));
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Posts on Categories</h2>
      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart>
            <Pie
              data={categoryData}
              cx={"50%"}
              cy={"50%"}
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend formatter={(value) => <span style={{ color: "#E5E7EB" }}>{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PostsOnCategoriesChart;
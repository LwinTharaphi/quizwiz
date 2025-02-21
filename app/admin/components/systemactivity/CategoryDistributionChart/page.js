"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#6366F1", "#10B981"]; // Blue for Creators, Green for Participants

const CategoryDistributionChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/admin/stats")
      .then((res) => res.json())
      .then((stats) => {
        console.log("Fetched stats:", stats); // Debugging: Check API response

        if (stats.userDistribution) {
          setData([
            { name: "Creators", value: parseInt(stats.userDistribution.creators, 10) || 0 },
            { name: "Participants", value: parseInt(stats.userDistribution.players, 10) || 0 },
          ]);
        }
      })
      .catch((err) => console.error("Error fetching user distribution:", err));
  }, []);

  console.log("Chart Data:", data); // Debugging: Check processed data for the chart

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Creators and Participants</h2>
      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart>
            <Pie
              data={data}
              cx={"50%"}
              cy={"50%"}
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryDistributionChart;
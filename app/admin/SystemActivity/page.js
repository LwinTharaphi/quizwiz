"use client";
import { useEffect, useState } from "react";
import { PlusCircle, Check, Users } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header/page";
import StatCard from "../components/common/StatCard/page";
import CategoryDistributionChart from "../components/systemactivity/CategoryDistributionChart/page"; // Creators & Participants Pie Chart
import PostsOnCategoriesChart from "../components/systemactivity/PostsOnCategoriesChart/page"; // Posts on Categories Pie Chart
import Sidebar from "../components/common/Sidebar/page";

const SystemActivityPage = () => {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuizzesTaken: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    fetch("http://localhost:4000/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
        <Header title="System Activity" />
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 bg-gray-900">
          {/* STATS */}
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard name="Total Quizzes Created" icon={PlusCircle} value={stats.totalQuizzes} color="#6366F1" />
            <StatCard name="Total Quizzes Taken" icon={Check} value={stats.totalQuizzesTaken} color="#10B981" />
            <StatCard name="Total Users" icon={Users} value={stats.totalUsers} color="#8B5CF6" />
          </motion.div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PostsOnCategoriesChart /> {/* Ensure this renders Posts on Categories */}
            <CategoryDistributionChart /> {/* Ensure this renders Creators & Participants */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SystemActivityPage;
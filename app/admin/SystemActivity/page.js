"use client"
import { PlusCircle, Check, Users } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header/page";
import StatCard from "../components/common/StatCard/page";
import CategoryDistributionChart from "../components/systemactivity/CategoryDistributionChart/page";
import PostsOnCategoriesChart from "../components/systemactivity/PostsOnCategoriesChart/page";
import Sidebar from "../components/common/Sidebar/page";

const SystemActivityPage = () => {
	return (
		<div className="flex h-screen bg-gray-900">
			{/* Sidebar */}
			<Sidebar />
			<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
				<Header title='System Activity' />

				<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8 bg-gray-900'>
					{/* STATS */}
					<motion.div
						className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
					>
						<StatCard
							name="Total Quizzes Created"
							icon={PlusCircle}
							value="4,512"
							color="#6366F1"
						/>
						<StatCard
							name="Total Quizzes Taken"
							icon={Check}
							value="34,867"
							color="#10B981"
						/>
						<StatCard
							name="Total Users"
							icon={Users}
							value="12,345"
							color="#8B5CF6"
						/>
					</motion.div>
					{/* CHARTS */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
						<PostsOnCategoriesChart />
						<CategoryDistributionChart />
					</div>
				</main>
			</div>
		</div>
	);
};
export default SystemActivityPage;

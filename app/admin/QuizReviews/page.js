"use client"
import { motion } from "framer-motion";
import Header from "../components/common/Header/page";
import QuizReviewTable from "../components/reviews/page";
import Sidebar from "../components/common/Sidebar/page";

const QuizReviewPage = () => {
	return (
		<div className="flex h-screen bg-gray-900">
			{/* Sidebar */}
			<Sidebar />
			<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
				<Header title='Reviews' />

				<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8 bg-gray-900'>
					{/* STATS */}
					<motion.div
						className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
					>
					</motion.div>

					<QuizReviewTable />
				</main>
			</div>
		</div>
	);
};
export default QuizReviewPage;

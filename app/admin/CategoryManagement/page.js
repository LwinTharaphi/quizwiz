"use client"
import { motion } from "framer-motion";
import Header from "../components/common/Header/page";
import Categories from "../components/Categories/page";
import Sidebar from "../components/common/Sidebar/page";


const CategoryManagementPage = () => {
	return (
		<div className="flex h-screen bg-gray-900">
			{/* Sidebar */}
			<Sidebar />
			<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
				<Header title='Category Management' />

				<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8 bg-gray-900'>
					{/* STATS */}
					<motion.div
						className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
					>
					</motion.div>

					<Categories />
				</main>
			</div>
		</div>
	);
};
export default CategoryManagementPage;

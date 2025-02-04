"use client";

import { BarChart2, Users, BookOpen, Folder, UserCheck, Settings, Menu } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link"; // Use Next.js's Link component

const SIDEBAR_ITEMS = [
	{
		name: "System Activity",
		icon: BarChart2,
		color: "#6366F1",
		href: "/admin/SystemActivity",
	},
	{
		name: "User Management",
		icon: Users,
		color: "#EC4899",
		href: "/admin/Users",
	},
	{
		name: "Quiz Reviews",
		icon: BookOpen,
		color: "#8B5CF6",
		href: "/admin/QuizReviews",
	},
	{
		name: "Category Management",
		icon: Folder,
		color: "#10B981",
		href: "/admin/CategoryManagement",
	},
	// {
	// 	name: "Quiz Creators",
	// 	icon: UserCheck,
	// 	color: "#F59E0B",
	// 	href: "/admin/QuizCreatorsManagement",
	// },
	{
		name: "Settings",
		icon: Settings,
		color: "#6EE7B7",
		href: "/admin/Settings",
	},
];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
				isSidebarOpen ? "w-64" : "w-20"
			}`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
				{/* Sidebar toggle button */}
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit text-white"
				>
					<Menu size={24} />
				</motion.button>

				{/* QuizWiz Title */}
				<AnimatePresence>
					{isSidebarOpen && (
						<motion.div
							className="mt-4 text-center"
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
						>
							<h1 className="text-white text-xl font-bold">QuizWiz</h1>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Navigation items */}
				<nav className="mt-8 flex-grow">
					{SIDEBAR_ITEMS.map((item) => (
						<Link key={item.href} href={item.href}>
							<motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
								<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className="ml-4 whitespace-nowrap text-white"
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											{item.name}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</Link>
					))}
				</nav>
			</div>
		</motion.div>
	);
};

export default Sidebar;

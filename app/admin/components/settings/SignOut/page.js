"use client"
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const SignOut = () => {
	const router = useRouter();
	const handleSignOut = () => {
		// You can add logic for sign-out here, if needed
		router.push('/'); // Redirect to home page
	};
	return (
		<motion.div
			className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			{/* Header */}
			<div className="flex items-center mb-4">
				<LogOut className="text-blue-400 mr-3" size={24} />
				<h2 className="text-xl font-semibold text-gray-100">Sign Out</h2>
			</div>

			{/* Description */}
			<p className="text-gray-300 mb-4">
				Click below to safely log out of your account.
			</p>

			{/* Sign Out Button */}
			<button
				className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
        transition duration-200 w-full sm:w-auto flex items-center justify-center"
				onClick={handleSignOut} // Add onClick event here
			>
				<LogOut className="mr-2" size={20} />
				Sign Out
			</button>
		</motion.div>
	);
};

export default SignOut;

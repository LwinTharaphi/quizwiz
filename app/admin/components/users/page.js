"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const userData = [
	{ id: 1, name: "John Doe", email: "john@example.com", role: "Quiz Creator", status: "Active" },
	{ id: 2, name: "Jane Smith", email: "jane@example.com", role: "Quiz Creator", status: "Active" },
	{ id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Participant", status: "Inactive" },
	{ id: 4, name: "Alice Brown", email: "alice@example.com", role: "Quiz Creator", status: "Active" },
	{ id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "Participant", status: "Active" },
	{ id: 6, name: "Emily Davis", email: "emily@example.com", role: "Participant", status: "Inactive" },
	{ id: 7, name: "Sarah Johnson", email: "sarah@example.com", role: "Quiz Creator", status: "Active" },
	{ id: 8, name: "Mike Wilson", email: "mike@example.com", role: "Participant", status: "Inactive" },
	{ id: 9, name: "David Lee", email: "david@example.com", role: "Quiz Creator", status: "Active" },
	{ id: 10, name: "Lisa Chen", email: "lisa@example.com", role: "Participant", status: "Active" },
	{ id: 11, name: "Chris Brown", email: "chris@example.com", role: "Participant", status: "Inactive" },
	{ id: 12, name: "Sophia White", email: "sophia@example.com", role: "Participant", status: "Active" },
	{ id: 13, name: "Oliver Green", email: "oliver@example.com", role: "Quiz Creator", status: "Active" },
	{ id: 14, name: "Mia Carter", email: "mia@example.com", role: "Participant", status: "Inactive" },
	{ id: 15, name: "Liam Scott", email: "liam@example.com", role: "Quiz Creator", status: "Active" },
	{ id: 16, name: "Amelia Hall", email: "amelia@example.com", role: "Participant", status: "Active" },
	{ id: 17, name: "Noah Brown", email: "noah@example.com", role: "Participant", status: "Active" },
	{ id: 18, name: "Isabella King", email: "isabella@example.com", role: "Participant", status: "Inactive" },
	{ id: 19, name: "James Hill", email: "james@example.com", role: "Quiz Creator", status: "Active" },
	{ id: 20, name: "Charlotte Adams", email: "charlotte@example.com", role: "Participant", status: "Active" },
	{ id: 21, name: "Elijah Wright", email: "elijah@example.com", role: "Participant", status: "Active" },
	{ id: 22, name: "Ava Lopez", email: "ava@example.com", role: "Quiz Creator", status: "Active" },
	{ id: 23, name: "William Taylor", email: "william@example.com", role: "Participant", status: "Inactive" },
	{ id: 24, name: "Sophia Harris", email: "sophia.h@example.com", role: "Participant", status: "Active" },
	{ id: 25, name: "Benjamin Martin", email: "benjamin@example.com", role: "Quiz Creator", status: "Active" },
	{ id: 26, name: "Evelyn Clark", email: "evelyn@example.com", role: "Participant", status: "Inactive" },
	{ id: 27, name: "Lucas Lewis", email: "lucas@example.com", role: "Participant", status: "Active" },
	{ id: 28, name: "Grace Walker", email: "grace@example.com", role: "Participant", status: "Active" },
	{ id: 29, name: "Henry Hall", email: "henry@example.com", role: "Participant", status: "Inactive" },
	{ id: 30, name: "Ella Young", email: "ella@example.com", role: "Quiz Creator", status: "Active" },
];

const getRoleColor = (role) => {
	switch (role) {
		case "Admin":
			return "bg-red-100 text-red-600";
		case "Quiz Creator":
			return "bg-yellow-100 text-yellow-600";
		case "Participant":
			return "bg-green-100 text-green-600";
		default:
			return "bg-gray-100 text-gray-600";
	}
};

const UsersTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// Filter users based on search
	const filteredUsers = userData.filter(
		(user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Paginate users
	const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
	const paginatedUsers = filteredUsers.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1); // Reset to first page when searching
	};

	const handlePageChange = (page) => setCurrentPage(page);

	return (
		<motion.div
			className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			{/* Header and Search */}
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-semibold text-gray-100">User Management</h2>
				<div className="relative">
					<input
						type="text"
						placeholder="Search users..."
						className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
				</div>
			</div>

			{/* User Table */}
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-700">
					<thead>
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
							{/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th> */}
						</tr>
					</thead>

					<tbody className="divide-y divide-gray-700">
						{paginatedUsers.map((user) => (
							<motion.tr
								key={user.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
											{user.name.charAt(0)}
										</div>
										<div className="ml-4">
											<div className="text-sm font-medium text-gray-100">{user.name}</div>
										</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-300">{user.email}</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
										{user.role}
									</span>
								</td>
								{/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
									<button className="text-indigo-400 hover:text-indigo-300 mr-2">Edit</button>
									<button className="text-red-400 hover:text-red-300">Delete</button>
								</td> */}
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="mt-4 flex justify-between items-center">
				<span className="text-sm text-gray-400">
					Showing {itemsPerPage * (currentPage - 1) + 1}-
					{Math.min(itemsPerPage * currentPage, filteredUsers.length)} of {filteredUsers.length} users
				</span>
				<div className="flex items-center space-x-2">
					<button
						className={`px-3 py-1 text-sm rounded-lg ${
							currentPage === 1 ? "text-gray-500 cursor-not-allowed" : "text-blue-400 hover:bg-gray-700"
						}`}
						onClick={() => handlePageChange(currentPage - 1)}
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
							onClick={() => handlePageChange(index + 1)}
						>
							{index + 1}
						</button>
					))}
					<button
						className={`px-3 py-1 text-sm rounded-lg ${
							currentPage === totalPages ? "text-gray-500 cursor-not-allowed" : "text-blue-400 hover:bg-gray-700"
						}`}
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						Next
					</button>
				</div>
			</div>
		</motion.div>
	);
};

export default UsersTable;

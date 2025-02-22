// "use client"
// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Search } from "lucide-react";

// const initialCreators = [
//   { id: 1, name: "John Smith", email: "john.smith@example.com", quizzes: 15, status: "Active" },
//   { id: 2, name: "Sarah Johnson", email: "sarah.j@example.com", quizzes: 8, status: "Pending" },
//   { id: 3, name: "Michael Brown", email: "m.brown@example.com", quizzes: 23, status: "Active" },
//   { id: 4, name: "Emma Wilson", email: "emma.w@example.com", quizzes: 5, status: "Pending" },
//   { id: 5, name: "David Lee", email: "david.lee@example.com", quizzes: 12, status: "Active" },
//   { id: 6, name: "Lisa Anderson", email: "lisa.a@example.com", quizzes: 19, status: "Active" },
//   { id: 7, name: "James Wilson", email: "j.wilson@example.com", quizzes: 7, status: "Pending" },
//   { id: 8, name: "Maria Garcia", email: "m.garcia@example.com", quizzes: 31, status: "Active" },
//   { id: 9, name: "Robert Taylor", email: "r.taylor@example.com", quizzes: 4, status: "Pending" },
//   { id: 10, name: "Patricia Moore", email: "p.moore@example.com", quizzes: 16, status: "Active" },
//   { id: 11, name: "Chris Evans", email: "c.evans@example.com", quizzes: 18, status: "Active" },
//   { id: 12, name: "Rachel Green", email: "r.green@example.com", quizzes: 20, status: "Pending" },
//   { id: 13, name: "Mark Black", email: "m.black@example.com", quizzes: 22, status: "Active" },
//   { id: 14, name: "Laura White", email: "l.white@example.com", quizzes: 10, status: "Active" },
//   { id: 15, name: "Sophia Hill", email: "s.hill@example.com", quizzes: 12, status: "Pending" },
//   { id: 16, name: "Nancy Drew", email: "n.drew@example.com", quizzes: 14, status: "Active" },
//   { id: 17, name: "Anna Taylor", email: "a.taylor@example.com", quizzes: 15, status: "Pending" },
//   { id: 18, name: "Victor Hugo", email: "v.hugo@example.com", quizzes: 21, status: "Active" },
//   { id: 19, name: "William Brown", email: "w.brown@example.com", quizzes: 9, status: "Pending" },
//   { id: 20, name: "Olivia Parker", email: "o.parker@example.com", quizzes: 17, status: "Active" },
//   { id: 21, name: "Ethan Scott", email: "e.scott@example.com", quizzes: 11, status: "Active" },
//   { id: 22, name: "Emily Carter", email: "e.carter@example.com", quizzes: 13, status: "Pending" },
//   { id: 23, name: "Victoria King", email: "v.king@example.com", quizzes: 19, status: "Active" },
//   { id: 24, name: "Isabella Moore", email: "i.moore@example.com", quizzes: 6, status: "Pending" },
//   { id: 25, name: "Liam Green", email: "l.green@example.com", quizzes: 25, status: "Active" },
//   { id: 26, name: "Sophia Davis", email: "s.davis@example.com", quizzes: 8, status: "Pending" },
//   { id: 27, name: "Mason Lee", email: "m.lee@example.com", quizzes: 23, status: "Active" },
//   { id: 28, name: "Charlotte Hill", email: "c.hill@example.com", quizzes: 12, status: "Pending" },
//   { id: 29, name: "Harper Young", email: "h.young@example.com", quizzes: 30, status: "Active" },
//   { id: 30, name: "Benjamin Carter", email: "b.carter@example.com", quizzes: 10, status: "Pending" },
// ];

// const QuizCreatorManagementPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value.toLowerCase());
//     setCurrentPage(1);
//   };

//   const filteredCreators = initialCreators.filter(
//     (creator) =>
//       creator.name.toLowerCase().includes(searchTerm) ||
//       creator.email.toLowerCase().includes(searchTerm)
//   );

//   const totalPages = Math.ceil(filteredCreators.length / itemsPerPage);
//   const paginatedCreators = filteredCreators.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Active":
//         return "bg-green-100 text-green-600";
//       case "Pending":
//         return "bg-yellow-100 text-yellow-600";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   return (
//     <motion.div
//       className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.2 }}
//     >
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold text-gray-100">Quiz Creator</h2>
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search creators..."
//             className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-700">
//           <thead>
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Email
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Quizzes
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-700">
//             {paginatedCreators.map((creator) => (
//               <motion.tr
//                 key={creator.id}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{creator.name}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{creator.email}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{creator.quizzes}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(creator.status)}`}>
//                     {creator.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                   <button className="text-green-400 hover:text-green-300 mr-2">Approve</button>
//                   <button className="text-red-400 hover:text-red-300 mr-2">Reject</button>
//                   <button className="text-red-400 hover:text-red-300">Delete</button>
//                 </td>
//               </motion.tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="mt-4 flex justify-between items-center">
//         <span className="text-sm text-gray-400">
//           Showing {(currentPage - 1) * itemsPerPage + 1} -
//           {Math.min(currentPage * itemsPerPage, filteredCreators.length)} of {filteredCreators.length} entries
//         </span>
//         <div className="flex items-center space-x-2">
//           <button
//             className={`px-3 py-1 text-sm rounded-lg ${
//               currentPage === 1
//                 ? "text-gray-500 cursor-not-allowed"
//                 : "text-blue-400 hover:bg-gray-700"
//             }`}
//             onClick={() => setCurrentPage(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           {Array.from({ length: totalPages }).map((_, index) => (
//             <button
//               key={index}
//               className={`px-3 py-1 text-sm rounded-lg ${
//                 currentPage === index + 1
//                   ? "bg-blue-500 text-white"
//                   : "text-gray-400 hover:bg-gray-700"
//               }`}
//               onClick={() => setCurrentPage(index + 1)}
//             >
//               {index + 1}
//             </button>
//           ))}
//           <button
//             className={`px-3 py-1 text-sm rounded-lg ${
//               currentPage === totalPages
//                 ? "text-gray-500 cursor-not-allowed"
//                 : "text-blue-400 hover:bg-gray-700"
//             }`}
//             onClick={() => setCurrentPage(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default QuizCreatorManagementPage;

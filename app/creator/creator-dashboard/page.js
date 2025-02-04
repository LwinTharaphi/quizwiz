"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "@fortawesome/fontawesome-free/css/all.min.css";


const QuizCreator = () => {
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleCreateQuiz = () => {
        router.push("/creator/create"); // Navigate to the "Create" page
    };

    const handleNavigation = (path) => {
        router.push(path);
    };

    const quizzes = [
        { name: "Science Basics", category: "Science" },
        { name: "History 101", category: "History" },
        { name: "Math Trivia", category: "Mathematics" },
    ]; // Example quizzes

    return (
        <div style={styles.container}>
            {/* Profile Section */}
            <div
                style={styles.profileContainer}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <i className="fas fa-user-circle" style={styles.profileIcon}></i>
                {isDropdownOpen && (
                    <div style={styles.dropdownMenu}>
                        <div
                            style={styles.dropdownItem}
                        >
                            Home
                        </div>
                        <div
                            style={styles.dropdownItem}
                            onClick={() => handleNavigation("/creator/aboutus")}
                        >
                            About Us
                        </div>
                        <div
                            style={styles.dropdownItem}
                            onClick={() => handleNavigation("/creator/your-quiz")}
                        >
                            Your Quiz
                        </div>
                        <div
                            style={styles.dropdownItem}
                            onClick={() => handleNavigation("/")}
                        >
                            Log Out
                        </div>
                    </div>
                )}
            </div>


            {/* Main Content */}
            <div style={styles.content}>
                {/* Left Side: Recently Created Quizzes */}
                <div style={styles.leftPane}>
                    <h3 style={styles.heading}>Recently Created Quizzes</h3>
                    <ul style={styles.quizList}>
                        {quizzes.map((quiz, index) => (
                            <li key={index} style={styles.quizItem}>
                                <span style={styles.quizName}>{quiz.name}</span>
                                <br />
                                <span style={styles.quizCategory}>{quiz.category}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Side: Logo and Create Quiz Button */}
                <div style={styles.rightPane}>
                    <div style={styles.logo} />
                    <button style={styles.createButton} onClick={handleCreateQuiz}>
                        Create Quiz
                    </button>
                </div>
            </div>
        </div>
    );
};

// Inline styles
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
    },
    profileContainer: {
        position: "absolute",
        top: "10px",
        right: "30px",
        zIndex: 1000,
    },
    profileIcon: {
        fontSize: "50px", // Adjust size to match your design
        color: "#333",    // Customize color as needed
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        borderRadius: "50%", // Optional: Keep a circular feel
    },

    dropdownMenu: {
        position: "absolute",
        top: "60px",
        right: "0",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        width: "150px",
        zIndex: 1000,
    },
    dropdownItem: {
        padding: "10px",
        fontSize: "14px",
        color: "#333",
        cursor: "pointer",
        borderBottom: "1px solid #ddd",
        textAlign: "center",
    },
    content: {
        display: "flex",
        height: "calc(100vh - 60px)", // Subtract height of profile dropdown
    },
    leftPane: {
        flex: "1 1 25%",
        minWidth: "200px",
        maxWidth: "400px",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRight: "1px solid #ddd",
        overflowY: "auto",
    },
    heading: {
        fontSize: "18px",
        marginBottom: "15px",
        color: "#4682b4",
    },
    quizList: {
        listStyleType: "none",
        padding: 0,
    },
    quizItem: {
        padding: "10px",
        backgroundColor: "#fff",
        marginBottom: "10px",
        borderRadius: "5px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    quizName: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333",
    },
    quizCategory: {
        fontSize: "14px",
        color: "#666",
    },
    rightPane: {
        flex: "2 1 75%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
    },
    logo: {
        width: "400px",
        height: "300px",
        backgroundImage: "url('/quiz.png')", // Replace with your logo URL
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
    },
    createButton: {
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default QuizCreator;

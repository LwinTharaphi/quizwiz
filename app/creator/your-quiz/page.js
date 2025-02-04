"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons"; // Profile icon

const YourQuiz = () => {
    const router = useRouter();
    // Constant quizzes data
    const [quizzes, setQuizzes] = useState([
        { id: 1, name: "Science Basics", category: "Science" },
        { id: 2, name: "History 101", category: "History" },
        { id: 3, name: "Math Trivia", category: "Mathematics" },
    ]);

    // Profile dropdown state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Handle removing a quiz
    const handleRemoveQuiz = (id) => {
        setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== id));
    };

    // Handle navigation (or actions) from the dropdown
    const handleNavigation = (path) => {
        router.push(path);
    };

    return (
        <div style={styles.container}>
            {/* Profile Section */}
            <div style={styles.profileContainer}>
                <div
                    style={styles.profileLogo}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <FontAwesomeIcon icon={faUserCircle} style={styles.profileIcon} />
                </div>
                {isDropdownOpen && (
                    <div style={styles.dropdownMenu}>
                        <div
                            style={styles.dropdownItem}
                            onClick={() => handleNavigation("/creator/creator-dashboard")}
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

            {/* Left Side: Recently Created Quizzes */}
            <div style={styles.leftPane}>
                <h3 style={styles.heading}>Your Quizzes</h3>
                <ul style={styles.quizList}>
                    {quizzes.map((quiz) => (
                        <li key={quiz.id} style={styles.quizItem}>
                            <span style={styles.quizName}>{quiz.name}</span>
                            <br />
                            <span style={styles.quizCategory}>{quiz.category}</span>
                            <FontAwesomeIcon
                                icon={faTimes}
                                style={styles.removeIcon}
                                onClick={() => handleRemoveQuiz(quiz.id)}
                            />
                        </li>
                    ))}
                </ul>
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
    profileLogo: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "#ccc", // Placeholder color if no image is set
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    profileIcon: {
        fontSize: "50px",
        color: "#333",
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
    leftPane: {
        flex: "1 1 100%",
        minWidth: "200px",
        backgroundColor: "#f8f9fa",
        padding: "20px",
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
        position: "relative",
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
    removeIcon: {
        position: "absolute",
        top: "10px",
        right: "10px",
        cursor: "pointer",
        color: "#e74c3c",
        fontSize: "18px",
    },
};

export default YourQuiz;

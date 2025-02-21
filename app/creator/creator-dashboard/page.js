"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@fortawesome/fontawesome-free/css/all.min.css";

const QuizCreator = () => {
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [quizzes, setQuizzes] = useState([]); // State to store quizzes
    const [loading, setLoading] = useState(true); // Loading state to show while fetching data
    const [error, setError] = useState(null); // Error state for any potential API errors
    const [creatorId, setCreatorId] = useState("");

    useEffect(() => {
        const creatorId = localStorage.getItem("creatorId");
        if (creatorId) {
            setCreatorId(creatorId);
        } else {
            console.error("Creator ID not found in localStorage");
            setLoading(false);
            return;
        }

        if (creatorId) {
            // Fetch quizzes from the API based on creator_id
            fetch(`http://localhost:4000/creator-created-quiz?creator_id=${creatorId}`)
                .then((response) => response.json())
                .then((data) => {
                    setQuizzes(data); // Set fetched quizzes to state
                    setLoading(false); // Stop loading
                })
                .catch((err) => {
                    console.error("Error fetching quizzes:", err);
                    setError("Failed to load quizzes"); // Set error message if the fetch fails
                    setLoading(false); // Stop loading
                });
        } else {
            setError("Creator ID not found in localStorage");
            setLoading(false);
        }
    }, []);

    const handleCreateQuiz = () => {
        router.push("/creator/create"); // Navigate to the "Create" page
    };

    const handleNavigation = (path) => {
        router.push(path);
    };

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
                        <div style={styles.dropdownItem}>Home</div>
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
                    {loading && <p>Loading quizzes...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <ul style={styles.quizList}>
                        {quizzes.map((quiz, index) => (
                            <li key={index} style={styles.quizItem}>
                                <span style={styles.quizName}>{quiz.quiz_title}</span>
                                <br />
                                <span style={styles.quizCategory}>{quiz.category_title}</span>
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

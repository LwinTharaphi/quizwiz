"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AboutUs = () => {
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleNavigation = (path) => {
        router.push(path);
    };

    return (
        <div style={styles.container}>
            {/* Profile Section */}
            <div style={styles.profileContainer}>
                <i
                    className="fas fa-user-circle"
                    style={styles.profileLogo}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                ></i>
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
                        >
                            About us
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

            {/* About Us Content */}
            <div style={styles.content}>
                <div style={styles.logo}></div>
                <div style={styles.aboutContainer}>
                    <h2 style={styles.heading}>About Us</h2>
                    <p style={styles.text}>
                        Welcome to our website! This platform allows you to create, manage, 
                        and participate in interactive quizzes across various topics. 
                        Whether you are a teacher, student, or trivia enthusiast, our tools 
                        are designed to make learning and fun seamless. Explore the endless 
                        possibilities of quiz creation and take your knowledge to the next level!
                    </p>
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
        position: "relative",
    },
    profileContainer: {
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: 1000,
    },
    profileLogo: {
        fontSize: "50px",
        color: "#333",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        backgroundColor: "#e6f7ff", // Pale blue background
        padding: "20px",
    },
    logo: {
        width: "150px",
        height: "150px",
        backgroundImage: "url('/quiz.png')", // Replace with your logo URL
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        marginBottom: "20px",
    },
    aboutContainer: {
        maxWidth: "600px",
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    heading: {
        fontSize: "24px",
        marginBottom: "10px",
        color: "#4682b4",
    },
    text: {
        fontSize: "16px",
        color: "#333",
        lineHeight: "1.6",
    },
};

export default AboutUs;

"use client";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from "next/navigation";

const CreatePage = () => {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        // Fetch categories from the backend
        axios.get('http://localhost:4000/categories')
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
                alert('Failed to load categories. Please try again later.');
            });
    }, []);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleNext = () => {
        if (selectedCategory) {
            // Navigate to the next step with the selected category
            router.push(`/creator/create/${selectedCategory}/add-questions`);
        } else {
            alert("Please select a category.");
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Create a New Quiz</h1>
            <div style={styles.content}>
                <img
                    src="/create.png" // Correct path for images in the public folder
                    alt="Quiz Illustration"
                    style={styles.image}
                />

                <div style={styles.controls}>
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        style={styles.dropdown}
                    >
                        <option value="" disabled>
                            Select a Category
                        </option>
                        {categories.map((category) => (
                            <option key={category.category_id} value={category.category_id}>
                                {category.category_title}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleNext} style={styles.nextButton}>
                        Next
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
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f9fa",
    },
    title: {
        fontSize: "24px",
        marginBottom: "20px",
        color: "#333",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    image: {
        width: "350px",
        height: "200px",
        marginBottom: "40px",
    },
    controls: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    dropdown: {
        padding: "10px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "1px solid #ddd",
        backgroundColor: "#fff",
    },
    nextButton: {
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default CreatePage;

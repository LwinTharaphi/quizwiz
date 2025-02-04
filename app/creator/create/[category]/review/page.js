"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ReviewPage = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    // Retrieve questions from localStorage
    const savedQuestions = localStorage.getItem("questions");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions)); // Parse the JSON string to get the array
    }
  }, []); // Runs only once when the component mounts

  const handlePost = () => {
    if (title) {
      alert("Quiz Created Successfully! We will review your quiz and publish it soon.");
      localStorage.removeItem("questions"); // Clear the questions after posting
      router.push("/creator/creator-dashboard"); // Redirect to the home page
    } else {
      alert("Please provide a quiz title.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Review Your Quiz</h1>
      <input
        type="text"
        placeholder="Enter Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.titleInput}
      />
      <ul style={styles.questionsList}>
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <li key={index} style={styles.questionItem}>
              <div style={styles.questionBox}>
                <h3>{question.text}</h3>
                <div style={styles.choicesContainer}>
                  {question.choices.map((choice, idx) => (
                    <div
                      key={idx}
                      style={{
                        ...styles.choiceItem,
                        backgroundColor: choice === question.correct ? "#d4edda" : "#f8f9fa",
                        border: choice === question.correct ? "2px solid #28a745" : "2px solid #ddd",
                      }}
                    >
                      <span
                        style={{
                          borderRadius: "50%",
                          padding: "5px 10px",
                          backgroundColor: choice === question.correct ? "#28a745" : "#6c757d",
                          color: "#fff",
                          marginRight: "10px",
                        }}
                      >
                        {idx + 1}
                      </span>
                      {choice}
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>No questions available.</p>
        )}
      </ul>
      <button onClick={handlePost} style={styles.postButton}>
        Post Quiz
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  titleInput: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  questionsList: {
    listStyleType: "none",
    paddingLeft: "0",
  },
  questionItem: {
    marginBottom: "30px",
  },
  questionBox: {
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  choicesContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    marginTop: "15px",
  },
  choiceItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "16px",
    width: "200px",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    cursor: "pointer",
  },
  postButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ReviewPage;

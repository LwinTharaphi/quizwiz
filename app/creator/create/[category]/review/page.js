"use client";  // Ensures that this is a client-side component

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";  // Import usePathname from next/navigation
import { useRouter } from 'next/navigation';

const ReviewPage = () => {
  const router = useRouter();
  const pathname = usePathname();  // Get the current path
  const categoryId = pathname?.split('/')[3];  // Extract the category ID from the URL
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [creatorId, setCreatorId] = useState(""); // Will be set from creator login
  const [categories, setCategories] = useState([]); // Will hold categories data from backend

  useEffect(() => {
    // Step 1: Retrieve questions from localStorage
    const savedQuestions = localStorage.getItem("questions");
    if (savedQuestions) {
      const parsedQuestions = JSON.parse(savedQuestions);
      console.log(parsedQuestions); // Log the parsed questions to inspect their structure
      setQuestions(parsedQuestions);
    }

    // Step 2: Get creatorId from localStorage or global state
    const savedCreatorId = localStorage.getItem("creatorId");
    if (savedCreatorId) {
      setCreatorId(savedCreatorId);
    }

    // Step 3: Fetch categories list from backend
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:4000/categories");
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []); // Runs on mount to fetch data

  const handlePost = async () => {
    console.log("title:", title);
    console.log("categoryId:", categoryId);
    console.log("creatorId:", creatorId);

    if (title && categoryId && creatorId) {
      const quizData = {
        title,
        categoryId,
        creatorId,
        adminId: 1,
        submittedDate: new Date().toISOString(),
      };

      try {
        // Step 1: Create Quiz
        const quizResponse = await fetch("http://localhost:5000/createQuiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quizData),
        });

        const quizResult = await quizResponse.json();
        console.log("Quiz creation response:", quizResult);

        if (quizResult.success && quizResult.quizId) {
          const quizId = quizResult.quizId;
          if (!quizId) {
            console.error("Quiz ID is missing!");
            alert("Error: Quiz ID is missing.");
            return;
          }

          const questionData = questions.map((question) => ({
            quizId,
            questionText: question.text,
            correctAnswer: question.correct,
            option1: question.option1,
            option2: question.option2,
            option3: question.option3,
            option4: question.option4,
          }));

          console.log("Sending question data:", questionData);

          // Step 3: Add Questions
          const questionsResponse = await fetch("http://localhost:5000/addQuestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questions: questionData }),
          });

          const questionsResult = await questionsResponse.json();
          console.log("Questions API response:", questionsResult);

          if (questionsResult.success) {
            alert("Quiz Created Successfully! We will review your quiz and publish it soon.");
            localStorage.removeItem("questions");
            router.push("/creator/creator-dashboard");
          } else {
            alert(`Failed to add questions: ${questionsResult.message}`);
            localStorage.removeItem("questions");
          }
        } else {
          alert("Failed to create quiz. Please try again.");
          localStorage.removeItem("questions");
        }
      } catch (error) {
        console.error("Error posting quiz:", error);
        alert("An error occurred while creating the quiz.");
        localStorage.removeItem("questions");
      }
    } else {
      alert("Please provide a quiz title, category, and creator.");
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
                  {[question.option1, question.option2, question.option3, question.option4].map((choice, idx) => (
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

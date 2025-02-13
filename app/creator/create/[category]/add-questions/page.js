"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

// Array of random colors
const paleColors = [
  "#FDE2E4", "#E2F0CB", "#D7E3FC", "#FCE1E4", "#FFF4E6",
  "#E9F5DB", "#E2ECF5", "#FBE4E6", "#E8F4F8", "#FAF3E3",
  "#F3E8E9", "#E4F0E2", "#FDF6EC", "#E2E6F0", "#FBE3E4",
  "#F4F9F9", "#EDEEF0", "#FFF8E7", "#F4F1E4", "#EFF5E9",
];

const AddQuestionsPage = () => {
  const router = useRouter();
  const { category } = useParams();
  const [questions, setQuestions] = useState([]); // Initialize as an empty array
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    correct: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
  });

  console.log("Category ID:", category);

  // Load questions from localStorage on component mount
  useState(() => {
    const savedQuestions = localStorage.getItem("questions");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  const handleAddMore = () => {
    if (
      currentQuestion.text &&
      currentQuestion.correct &&
      currentQuestion.option1 &&
      currentQuestion.option2 &&
      currentQuestion.option3 &&
      currentQuestion.option4
    ) {
      const updatedQuestions = [...questions, currentQuestion];
      setQuestions(updatedQuestions);
      localStorage.setItem("questions", JSON.stringify(updatedQuestions)); // Save to localStorage
  
      setCurrentQuestion({
        text: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correct: "",
      });
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleFinish = () => {
    if (currentQuestion.text) handleAddMore(); // Add the last question if it's filled
    router.push(`/creator/create/${category}/review`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Add a Question</h1>
      <textarea
        placeholder="Write your question here"
        value={currentQuestion.text}
        onChange={(e) =>
          setCurrentQuestion({ ...currentQuestion, text: e.target.value })
        }
        style={styles.textBox}
      />
      <div style={styles.choicesContainer}>
        {["option1", "option2", "option3", "option4"].map((optionKey, index) => {
          // Get a random color for each card
          const randomColor = paleColors[Math.floor(Math.random() * paleColors.length)];

          return (
            <div key={index} style={{ ...styles.choiceCard, backgroundColor: randomColor }}>
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={currentQuestion[optionKey]}
                onChange={(e) => {
                  setCurrentQuestion({
                    ...currentQuestion,
                    [optionKey]: e.target.value
                  });
                }}
                style={styles.choiceInput}
              />
            </div>
          );
        })}
      </div>
      <select
        value={currentQuestion.correct}
        onChange={(e) =>
          setCurrentQuestion({ ...currentQuestion, correct: e.target.value })
        }
        style={styles.dropdown}
      >
        <option value="" disabled>
          Select Correct Answer
        </option>
        {[currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4].map((choice, index) => (
          <option key={index} value={choice}>
            {choice}
          </option>
        ))}
      </select>
      <div style={styles.buttonsContainer}>
        <button onClick={handleFinish} style={styles.finishButton}>
          Finish
        </button>
        <button onClick={handleAddMore} style={styles.addMoreButton}>
          Add More
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  textBox: {
    width: "60%",
    height: "400px",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  choicesContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },
  choiceCard: {
    height: "120px",
    width: "70%",
    marginLeft: "50px",
    marginRight: "100px",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  choiceInput: {
    width: "60%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  dropdown: {
    width: "60%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  addMoreButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  finishButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AddQuestionsPage;

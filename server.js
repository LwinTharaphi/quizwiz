const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); 
require('dotenv').config(); 

const app = express(); 
app.use(cors());
app.use(express.json()); 

// Configure PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.post("/signup", async (req, res) => {
  const { username, email, password, userType } = req.body;

  // Check if all fields are provided
  if (!username || !email || !password || !userType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let insertQuery;
    let values = [username, password, userType, email];
    if (userType === "creator") {
      insertQuery = `
        INSERT INTO creator (username, password, type, email) 
        VALUES ($1, $2, $3, $4) RETURNING username`;
    } else if (userType === "player") {
      insertQuery = `
        INSERT INTO player (username, password, type, email) 
        VALUES ($1, $2, $3, $4) RETURNING username`;
    } else {
      return res.status(400).json({ error: "Invalid user type" });
    }

    // Execute the insert query
    const result = await pool.query(insertQuery, values);

    // Respond with success message
    res.status(201).json({ message: "User registered successfully", user: result.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, email, password, userType } = req.body;

  if (!username || !email || !password || !userType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let query;
    let values = [username, email];

    // Determine the table and ID field based on userType
    if (userType === "creator") {
      query = `
        SELECT creator_id, password FROM creator WHERE username = $1 AND email = $2`;
    } else if (userType === "player") {
      query = `
        SELECT player_id, password FROM player WHERE username = $1 AND email = $2`;
    } else {
      return res.status(400).json({ error: "Invalid user type" });
    }

    // Check if the user exists in the database
    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (user && user.password === password) {
      // Include the appropriate ID in the response
      const responseData = {
        message: "Login successful",
        user: {
          username,
          email,
        },
      };

      if (userType === "creator") {
        responseData.creator_id = user.creator_id;
      } else if (userType === "player") {
        responseData.player_id = user.player_id;
      }

      return res.status(200).json(responseData);
    } else {
      return res.status(401).json({ error: "Invalid username, email, or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


app.post('/addQuestions', async (req, res) => {
  const { questions } = req.body;

  try {
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.json({ success: false, message: "No questions provided." });
    }

    for (let question of questions) {
      const { quizId, questionText, correctAnswer, option1, option2, option3, option4 } = question;

      // Ensure `quizId` and all required fields are present
      if (!quizId || !questionText || !correctAnswer || !option1 || !option2 || !option3 || !option4) {
        return res.json({ success: false, message: "Missing required fields in a question." });
      }

      const questionQuery = `
        INSERT INTO Question 
        (quiz_id, question_text, correct_ans, option1, option2, option3, option4) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

      // Insert question into the database
      await pool.query(questionQuery, [
        quizId, 
        questionText, 
        correctAnswer, 
        option1, 
        option2, 
        option3, 
        option4
      ]);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Database error adding questions:", error);
    res.status(500).json({ success: false, message: "Database error: " + error.message });
  }
});


app.post('/createQuiz', async (req, res) => {
  const { title, categoryId, creatorId, adminId, submittedDate } = req.body;

  try {
    const quizQuery = 'INSERT INTO Quiz (quiz_title, category_id, creator_id, admin_id, submitted_date) VALUES ($1, $2, $3, $4, $5) RETURNING quiz_id';
    const quizResult = await pool.query(quizQuery, [title, categoryId, creatorId, adminId, submittedDate]);
    
    const quizId = quizResult.rows[0].quiz_id; // Get the newly created quiz_id
    res.json({ success: true, quizId });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.json({ success: false, message: "Error creating quiz" });
  }
});

app.post('/save-score', async (req, res) => {
  const { totalScore, quizId, playerId } = req.body; // Get playerId from frontend request body
  
  // Validate input
  if (totalScore === null || totalScore === undefined || quizId === undefined || playerId === undefined) {
    return res.status(400).json({ success: false, message: "Missing required data." });
  }

  const scoreDate = new Date(); // Current date and time for the score

  try {
    // Insert the score into the database (no need to handle score_id as it's auto-incremented)
    const insertQuery = `
      INSERT INTO scorerecord (total_score, score_date, quiz_id, player_id) 
      VALUES ($1, $2, $3, $4)
    `;

    await pool.query(insertQuery, [
      totalScore,
      scoreDate,
      quizId,
      playerId
    ]);

    res.json({ success: true, message: "Score saved successfully." });
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({ success: false, message: "Error saving score." });
  }
});

app.put('/update-score', async (req, res) => {
  const { totalScore, quizId, playerId } = req.body;

  if (totalScore === null || totalScore === undefined || quizId === undefined || playerId === undefined) {
    return res.status(400).json({ success: false, message: "Missing required data." });
  }

  try {
    const updateQuery = `
      UPDATE scorerecord 
      SET total_score = $1, score_date = $2 
      WHERE quiz_id = $3 AND player_id = $4;
    `;

    const result = await pool.query(updateQuery, [totalScore, new Date(), quizId, playerId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "No existing record found to update." });
    }

    res.json({ success: true, message: "Score updated successfully." });
  } catch (error) {
    console.error("Error updating score:", error);
    res.status(500).json({ success: false, message: "Error updating score." });
  }
});

app.get("/check-score", async (req, res) => {
  const { playerId, quizId } = req.query;

  if (!playerId || !quizId) {
    return res.status(400).json({ success: false, message: "Missing playerId or quizId." });
  }

  try {
    const checkQuery = `
      SELECT EXISTS (
        SELECT 1 FROM scorerecord 
        WHERE player_id = $1 AND quiz_id = $2
      );
    `;

    const result = await pool.query(checkQuery, [playerId, quizId]);
    const exists = result.rows[0].exists;

    res.json({ success: true, exists });
  } catch (error) {
    console.error("Error checking score record:", error);
    res.status(500).json({ success: false, message: "Error checking score record." });
  }
});


// Endpoint to fetch categories
app.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT category_id, category_title, description FROM category');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});


// Endpoint to fetch quizsets along with category title
app.get('/quizsets', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         quiz.quiz_title, 
         category.category_title,
         quiz.quiz_id,
         COUNT(question.question_id) AS no_of_questions,
         (COUNT(question.question_id) * 45) AS allowed_time
       FROM quiz
       JOIN category ON quiz.category_id = category.category_id
       LEFT JOIN question ON quiz.quiz_id = question.quiz_id
       GROUP BY quiz.quiz_title, category.category_title, quiz.quiz_id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});


app.get("/questions", async (req, res) => {
  try {
    const { quiz_id } = req.query; // Get quiz_id from query params

    if (!quiz_id) {
      return res.status(400).json({ error: "quiz_id is required" });
    }

    const query = `
      SELECT question_id, question_text, correct_ans, option1, option2, option3, option4, quiz_id 
      FROM question 
      WHERE quiz_id = $1
    `;

    const result = await pool.query(query, [quiz_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No questions found for this quiz" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/player-history", async (req, res) => {
  const { player_id } = req.query;
  
  try {
    const query = `
      SELECT s.total_score, s.score_date, q.quiz_title, s.score_id
      FROM scorerecord s
      JOIN quiz q ON s.quiz_id = q.quiz_id
      WHERE s.player_id = $1
      ORDER BY s.score_date DESC;
    `;

    const result = await pool.query(query, [player_id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching player scores:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/creator-created-quiz", async (req, res) => {
  const { creator_id } = req.query;
  
  try {
    const query = `
      SELECT q.quiz_id, q.quiz_title, c.category_title
      FROM quiz q
      JOIN category c ON q.category_id = c.category_id
      WHERE q.creator_id = $1
    `;

    const result = await pool.query(query, [creator_id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/clear-quiz", async (req, res) => {
  const { quiz_id } = req.query; // Use req.query for query parameters
  console.log("Deleting quiz with quiz_id:", quiz_id); // Debugging
  try {
    const query = "DELETE FROM quiz WHERE quiz_id = $1";
    const result = await pool.query(query, [quiz_id]);
    console.log("Delete query result:", result.rowCount); // Debugging
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting record:", error);
    res.status(500).json({ error: "Failed to delete quiz" });
  }
});


app.delete("/clear-single-record", async (req, res) => {
  const { score_id } = req.query; // Use req.query for query parameters
  console.log("Deleting record with score_id:", score_id); // Debugging
  try {
    const query = "DELETE FROM scorerecord WHERE score_id = $1";
    const result = await pool.query(query, [score_id]);
    console.log("Delete query result:", result.rowCount); // Debugging
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting record:", error);
    res.status(500).json({ error: "Failed to delete record" });
  }
});

app.delete("/clear-all-records", async (req, res) => {
  const { player_id } = req.query;
  try {
    const query = "DELETE FROM scorerecord WHERE player_id = $1";
    await pool.query(query, [player_id]);
    res.status(200).json({ message: "All records deleted successfully" });
  } catch (error) {
    console.error("Error clearing records:", error);
    res.status(500).json({ error: "Failed to clear all records" });
  }
});


//For Admin
app.get("/all-users", async (req, res) => {
  try {
    // SQL query to get all creators and players as separate sets, then combine them using UNION
    const query = `
      SELECT username, email, type, creator_id as id
      FROM creator
      UNION
      SELECT username, email, type, player_id as id
      FROM player
    `;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
});



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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
      `SELECT quiz.quiz_title, category.category_title 
       FROM quiz
       JOIN category ON quiz.category_id = category.category_id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

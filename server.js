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

//Sign Up Login
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

// For Creator to add questions
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

// For creators to create quiz
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

// For creators and players to get categories
// GET Categories with Quiz Count
app.get("/categories", async (req, res) => {
  try {
    const query = `
      SELECT 
        c.category_id, 
        c.category_title, 
        c.description, 
        COALESCE(COUNT(q.quiz_id), 0) AS quiz_count 
      FROM category c
      LEFT JOIN quiz q ON c.category_id = q.category_id
      GROUP BY c.category_id, c.category_title, c.description
      ORDER BY c.category_id;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST Create New Category
app.post("/categories", async (req, res) => {
  const { category_title, description } = req.body;
  if (!category_title || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const query = `
      INSERT INTO category (category_title, description, admin_id) 
      VALUES ($1, $2, 1) RETURNING *;
    `;
    const result = await pool.query(query, [category_title, description]);
    res.status(201).json(result.rows[0]); // Return new category
  } catch (err) {
    console.error("Error adding category:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// PUT Update a Category with quiz count preserved
app.put("/categories/:id", async (req, res) => {
  const { id } = req.params;
  const { category_title, description } = req.body;
  
  try {
    // Use a Common Table Expression (CTE) to update and then join with the quiz table
    const query = `
      WITH updated AS (
        UPDATE category 
        SET 
          category_title = COALESCE($1, category_title),
          description = COALESCE($2, description)
        WHERE category_id = $3
        RETURNING *
      )
      SELECT 
        updated.*,
        COALESCE(COUNT(q.quiz_id), 0) AS quiz_count
      FROM updated
      LEFT JOIN quiz q ON updated.category_id = q.category_id
      GROUP BY updated.category_id, updated.category_title, updated.description, updated.admin_id;
    `;
    
    const values = [
      category_title ?? null,
      description ?? null,
      id,
    ];
    
    const result = await pool.query(query, values);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE a Category
app.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const query = `DELETE FROM category WHERE category_id = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// For creators to get their created quizzes in history or in recently created quiz
app.get("/creator-created-quiz", async (req, res) => {
  const { creator_id } = req.query;

  try {
    const query = `
      SELECT q.quiz_id, q.quiz_title, c.category_title, q.isapproved
      FROM quiz q
      JOIN category c ON q.category_id = c.category_id
      WHERE q.creator_id = $1 AND q.isapproved = 'approved'
    `;

    const result = await pool.query(query, [creator_id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// For creators to delete quiz
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


// For players to record their score for the first time
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

// For players to update their score if they take the same quiz again
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

// For players to check score if they have taken the specific quiz or not
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


// For players to get quiz sets under each category
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
       WHERE quiz.isapproved = 'approved'  
       GROUP BY quiz.quiz_title, category.category_title, quiz.quiz_id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// For players to get questions for each quiz
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

// For player to get the quizzes that took
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

// For players to delete a single score record
app.delete("/clear-single-record", async (req, res) => {
  const { score_id } = req.query; 
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

// For players to delete their all score record
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


//For Admin to get all users in user page
app.get("/all-users", async (req, res) => {
  try {
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

// For admin to review the quizes
// GET quizzes pending review (read-only)
app.get("/review_quiz", async (req, res) => {
  try {
    const query = `
      SELECT 
        q.quiz_id,
        q.quiz_title,
        q.isapproved,
        q.submitted_date,
        creator.username,
        category.category_title,
        COUNT(question.question_id) AS number_of_questions
      FROM quiz q
      JOIN creator ON q.creator_id = creator.creator_id
      JOIN question ON question.quiz_id = q.quiz_id
      JOIN category ON q.category_id = category.category_id  
      GROUP BY q.quiz_id, creator.username, category.category_title, q.submitted_date, q.isapproved
      ORDER BY q.submitted_date DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching review quizzes:", err);
    res.status(500).send("Server error");
  }
});

// PUT update quiz approval status (for Approve or Reject actions)
app.put("/approve_quiz", async (req, res) => {
  const { quizId, status } = req.query;
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be "approved" or "rejected".' });
  }
  try {
    const query = "UPDATE quiz SET isapproved = $1 WHERE quiz_id = $2 RETURNING *;";
    const result = await pool.query(query, [status, quizId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Quiz not found." });
    }
    return res.status(200).json({
      message: "Quiz approval status updated successfully.",
      quiz: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating quiz status:", err);
    return res.status(500).json({ message: "Error updating quiz status.", error: err });
  }
});

//For Quiz Review from Admin
app.get("/quiz_details", async (req, res) => {
  const { quizId } = req.query;
  if (!quizId) {
    return res.status(400).json({ error: "Missing quizId" });
  }

  try {
    // 1. Fetch quiz info
    const quizInfoQuery = `
      SELECT q.quiz_id, q.quiz_title, q.isapproved, q.submitted_date,
             creator.username, category.category_title
      FROM quiz q
      JOIN creator ON q.creator_id = creator.creator_id
      JOIN category ON q.category_id = category.category_id
      WHERE q.quiz_id = $1
    `;
    const quizInfoResult = await pool.query(quizInfoQuery, [quizId]);

    if (quizInfoResult.rows.length === 0) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const quizData = quizInfoResult.rows[0];

    // 2. Fetch questions
    const questionsQuery = `
      SELECT question_id, question_text, option1, option2, option3, option4, correct_ans
      FROM question
      WHERE quiz_id = $1
    `;
    const questionsResult = await pool.query(questionsQuery, [quizId]);

    // Combine quiz info + questions
    const fullQuiz = {
      quiz_id: quizData.quiz_id,
      quiz_title: quizData.quiz_title,
      isapproved: quizData.isapproved,
      submitted_date: quizData.submitted_date,
      username: quizData.username,
      category_title: quizData.category_title,
      questions: questionsResult.rows
    };

    res.json(fullQuiz);
  } catch (err) {
    console.error("Error fetching quiz details:", err);
    res.status(500).json({ error: "Database error" });
  }
});

//For admin system activity
app.get("/admin/stats", async (req, res) => {
  try {
    // Fetch total number of quizzes created
    const totalQuizzes = await pool.query("SELECT COUNT(*) FROM quiz");

    // Fetch total number of quizzes taken (score records indicate quizzes played)
    const totalQuizzesTaken = await pool.query("SELECT COUNT(*) FROM scorerecord");

    // Fetch total users (sum of creators and players)
    const totalUsers = await pool.query(`
      SELECT (
        (SELECT COUNT(*) FROM creator) + 
        (SELECT COUNT(*) FROM player)
      ) AS total_users
    `);

    // Fetch category distribution
    const categoryStats = await pool.query(`
      SELECT c.category_title, COUNT(q.quiz_id) AS count
      FROM quiz q
      JOIN category c ON q.category_id = c.category_id
      GROUP BY c.category_title
    `);

    // Fetch user distribution (creators vs players)
    const creatorsCount = await pool.query("SELECT COUNT(*) AS count FROM creator");
    const playersCount = await pool.query("SELECT COUNT(*) AS count FROM player");

    res.json({
      totalQuizzes: totalQuizzes.rows[0].count,
      totalQuizzesTaken: totalQuizzesTaken.rows[0].count,
      totalUsers: totalUsers.rows[0].total_users,
      categoryStats: categoryStats.rows,
      userDistribution: {
        creators: creatorsCount.rows[0].count,
        players: playersCount.rows[0].count,
      },
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Database error" });
  }
});



const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); 

const app = express();
app.use(cors());
app.use(express.json());

// Configure PostgreSQL connection securely
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
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

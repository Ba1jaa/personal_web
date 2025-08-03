import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

// import dotenv from 'dotenv';
// dotenv.config();

// import pkg from 'pg';
// const { Pool } = pkg;

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// local pg
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'baljaa',
//   password: '0608',
//   port: 5432,
// });
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


//
const app = express();
//const port = 3000;
const port = process.env.PORT || 3000;  // Use Render's port if available, otherwise default to 3000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch(err => console.error('❌ Connection error', err.stack));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));
// Set up body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Route
app.get('/', (req, res) => {
  res.render("index");
});

app.post('/submit', async (req, res) => {
  const { question, action } = req.body;

  if (action === 'Send') {
    try {
      await pool.query('INSERT INTO questions(question_text) VALUES($1)', [question]);
      console.log('Question saved:', question);
      res.redirect('/?success=true'); // ✅ optional improvement: avoids form resubmission
    } catch (err) {
      console.error('Error inserting into DB:', err);
      res.status(500).send('Failed to save your question.');
    }
  } else if (action === 'Clear') {
    res.redirect('/');
  } else {
    res.send('Unknown action.');
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
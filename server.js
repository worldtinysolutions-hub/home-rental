import express from "express";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors()); // Allow cross-origin from frontend
app.use(bodyParser.json());

// ✅ Initialize SQLite
const db = new sqlite3.Database("users.db", (err) => {
  if (err) console.error("DB connection error:", err);
  else console.log("✅ Connected to SQLite database");
});

// ✅ Create table if not exists
db.run(
  "CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, password TEXT)",
  (err) => {
    if (err) console.error("Table creation error:", err);
    else console.log("✅ Table ready");
  }
);

// 🧾 Register
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const hashed = await bcrypt.hash(password, 10);
    db.run(
      "INSERT OR REPLACE INTO users (email, password) VALUES (?, ?)",
      [email, hashed],
      (err) => {
        if (err) {
          console.error("Insert error:", err);
          return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true });
      }
    );
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🔑 Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
    if (err) {
      console.error("DB lookup error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (!row) return res.status(400).json({ error: "User not found" });

    try {
      const match = await bcrypt.compare(password, row.password);
      if (match) {
        res.json({ success: true });
      } else {
        res.status(400).json({ error: "Invalid password" });
      }
    } catch (compareErr) {
      console.error("Password compare error:", compareErr);
      res.status(500).json({ error: "Internal error" });
    }
  });
});

// 🩵 Health check
app.get("/", (req, res) => {
  res.json({ message: "Server is running 🚀" });
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

import express from "express";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public")); // serves index.html, script.js, etc.

const db = new sqlite3.Database("users.db");
db.run("CREATE TABLE IF NOT EXISTS users (email TEXT UNIQUE, password TEXT)");

// 🧩 Register user
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing email or password" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashed],
      (err) => {
        if (err) {
          if (err.message.includes("UNIQUE"))
            return res.status(400).json({ error: "User already exists" });
          return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🔐 Login user
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!row) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, row.password);
    match
      ? res.json({ success: true })
      : res.status(400).json({ error: "Invalid password" });
  });
});

// 🏡 Homes endpoint (returns listings)
app.get("/homes", (req, res) => {
  const homes = [
    {
      title: "Cozy Apartment in Gothenburg",
      location: "Gothenburg, Sweden",
      price: "12,000 kr / month",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    },
    {
      title: "Modern Condo in Hisingen",
      location: "Hisingen, Gothenburg, Sweden",
      price: "10,800 kr / month",
      image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
    },
    {
      title: "Family Home in Malmö",
      location: "Malmö, Sweden",
      price: "13,000 kr / month",
      image: "https://images.unsplash.com/photo-1599423300746-b62533397364",
    },
  ];
  res.json(homes);
});

// 🚀 Start server
app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));

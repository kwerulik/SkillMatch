const express = require("express");
const users = [];
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = "supersecretkey";

const app = express();
app.use(cors());
app.use(express.json());

async function createUser() {
  const hashed = await bcrypt.hash("test123", 10);
  users.push({
    username: "janek",
    password: hashed,
    name: "Jan Kowalski",
    bio: "Frontend dev",
    skills: ["React", "Node.js"],
  });
}
createUser();

//Testowy endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend działa!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server działa na porcie ${PORT}`);
});


//Rejsetracja
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "Użytkownik już istnieje" });
  }

  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed });

  res.json({ message: "Zarejestrowano pomyślnie" });
});

//Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ message: "Nieprawidłowy login" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ message: "Nieprawidłowe hasło" });

  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

//Weryfikacja tokena
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Brak tokena" });

  const token = authHeader.split(" ")[1];
  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Niepoprawny token" });
  }
}

//Pobieranie profilu po zalogowaniu
app.get("/api/profile", authMiddleware, (req, res) => {
  const user = users.find((u) => u.username === req.user.username);
  if (!user)
    return res.status(404).json({ message: "Nie znaleziono użytkownika" });

  const { password, ...profile } = user; 
  res.json(profile);
});

//edycja profilu
app.put("/api/profile", authMiddleware, (req, res) => {
  const user = users.find((u) => u.username === req.user.username);
  if (!user)
    return res.status(404).json({ message: "Nie znaleziono użytkownika" });

  const { name, bio, skills } = req.body;
  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (skills !== undefined && Array.isArray(skills)) user.skills = skills;

  res.json({ message: "Profil zaktualizowany" });
});
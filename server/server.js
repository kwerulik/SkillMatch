const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = "supersecretkey";
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Połączono z MongoDB Atlas!'))
.catch(err => console.error('Błąd połączenia z MongoDB:', err));

const app = express();
app.use(cors());
app.use(express.json());

// Dodaj domyślnego użytkownika przy starcie serwera
async function ensureDefaultUser() {
  const existing = await User.findOne({ username: 'janek' });
  if (!existing) {
    const hashed = await bcrypt.hash('test123', 10);
    await User.create({
      username: 'janek',
      password: hashed,
      name: 'Jan Kowalski',
      bio: 'Frontend dev',
      skills: ['React', 'Node.js'],
    });
    console.log('Dodano domyślnego użytkownika janek (hasło: test123)');
  }
}
ensureDefaultUser();

// Dodaj domyślne projekty przy starcie serwera
async function ensureDefaultProjects() {
  const count = await Project.countDocuments();
  if (count === 0) {
    await Project.insertMany([
      {
        title: "Aplikacja do zarządzania zadaniami",
        description: "Prosta aplikacja kanban z Reactem i Node.js.",
        skillsRequired: ["React", "Node.js", "MongoDB"],
        owner: "janek",
        members: ["janek"],
      },
      {
        title: "Strona portfolio dla grafika",
        description: "Potrzebuję frontend developera do zbudowania mojego portfolio.",
        skillsRequired: ["HTML", "CSS", "React"],
        owner: "ania",
        members: ["ania"],
      },
      {
        title: "AI Chatbot do nauki języków",
        description: "Pomysł na aplikację z AI do nauki języków, potrzebny backend i NLP specjalista.",
        skillsRequired: ["Python", "NLP", "React"],
        owner: "marek",
        members: ["marek"],
      },
      {
        title: "Kalkulator budżetu domowego",
        description: "Chcę zrobić prostą appkę finansową na React Native.",
        skillsRequired: ["React Native", "TypeScript", "Firebase"],
        owner: "ola",
        members: ["ola"],
      },
    ]);
    console.log('Dodano przykładowe projekty do bazy');
  }
}
ensureDefaultProjects();

//Testowy endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend działa!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server działa na porcie ${PORT}`);
});


//Rejestracja
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "Użytkownik już istnieje" });
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed });
    res.json({ message: "Zarejestrowano pomyślnie" });
  } catch (err) {
    res.status(500).json({ message: "Błąd rejestracji", error: err });
  }
});

//Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
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
app.get("/api/profile", authMiddleware, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(404).json({ message: "Nie znaleziono użytkownika" });
  const { password, ...profile } = user.toObject();
  res.json(profile);
});

//edycja profilu
app.put("/api/profile", authMiddleware, async (req, res) => {
  const { name, bio, skills } = req.body;
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(404).json({ message: "Nie znaleziono użytkownika" });
  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (skills !== undefined && Array.isArray(skills)) user.skills = skills;
  await user.save();
  res.json({ message: "Profil zaktualizowany" });
});

//Tworzenie nowego projektu
app.post("/api/projects", authMiddleware, async (req, res) => {
  const { title, description, skillsRequired } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: "Brakuje wymaganych pól" });
  }
  try {
    const newProject = await Project.create({
      title,
      description,
      skillsRequired: skillsRequired || [],
      owner: req.user.username,
      members: [req.user.username],
    });
    res.status(201).json({ message: "Projekt utworzony", project: newProject });
  } catch (err) {
    res.status(500).json({ message: "Błąd tworzenia projektu", error: err });
  }
});

//Wszystkie projekty
app.get("/api/projects", async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

//Dołączanie do projektu
app.post("/api/projects/:id/join", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Nie znaleziono projektu" });
    if (project.members.includes(req.user.username)) {
      return res.status(400).json({ message: "Już jesteś w projekcie" });
    }
    project.members.push(req.user.username);
    await project.save();
    res.json({ message: "Dołączono do projektu" });
  } catch (err) {
    res.status(500).json({ message: "Błąd dołączania do projektu", error: err });
  }
});
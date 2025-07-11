# SkillMatch

SkillMatch is a full-stack web application for connecting developers and creatives to collaborate on projects. Users can create profiles, list their skills, create and join projects, and manage their collaboration online.

## Features
- User registration and login (JWT authentication)
- User profile with editable bio and skills
- Project creation with required skills
- Join projects as a team member
- Responsive, modern UI (React)
- MongoDB Atlas database integration

## Tech Stack
- **Frontend:** React (Vite), CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (via Mongoose)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
https://github.com/yourusername/SkillMatch.git
cd SkillMatch
```

### 2. Setup the backend
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=SkillMatch
```
Replace `<db_username>` and `<db_password>` with your MongoDB Atlas credentials.

Start the backend:
```bash
node server.js
# or
npm start
```

The backend will run on `http://localhost:5000` by default.

### 3. Setup the frontend
```bash
cd ../client/skill-match
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` by default.

## Usage
- Register a new account or use the default user:
  - **Username:** janek
  - **Password:** test123
- Edit your profile, add your skills and bio.
- Create new projects or join existing ones.

## Project Structure
```
SkillMatch/
  client/skill-match/    # React frontend
  server/                # Node.js/Express backend
```

## Environment Variables
- `MONGODB_URI` – MongoDB connection string (see above)

## License
MIT

---
Feel free to contribute or open issues/PRs!

import React, { useState } from "react";
import Login from "./Login";
import Profile from "./Profile";
import Projects from "./Projects";
import "./index.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [section, setSection] = useState("profile");

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <nav className="navbar">
        <span className="navbar-logo">SkillMatch</span>
        <div className="navbar-links">
          <button
            className="navbar-link"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onClick={() => setSection("profile")}
          >
            Profil
          </button>
          <button
            className="navbar-link"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onClick={() => setSection("projects")}
          >
            Projekty
          </button>
          <button className="navbar-logout" onClick={handleLogout}>
            Wyloguj się
          </button>
        </div>
      </nav>
      <div className="app-container">
        {section === "profile" && <Profile token={token} />}
        {section === "projects" && <Projects token={token} />}
      </div>
    </>
  );
}

export default App;

import React, { useState } from "react";
import Login from "./Login";
import Profile from "./Profile";
import Projects from "./Projects";


function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

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
    <div>
      <h1>SkillMatch</h1>
      <button onClick={handleLogout}>Wyloguj się</button>
      <Profile token={token} />
      <Projects token={token}></Projects>
    </div>
  );
}

export default App;

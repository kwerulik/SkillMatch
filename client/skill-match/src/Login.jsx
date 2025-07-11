import React, { useState } from "react";
import api from "./api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isRegister ? "/register" : "/login";
      const res = await api.post(url, { username, password });
      setMessage(res.data.message || "Sukces!");
      if (!isRegister && res.data.token) {
        onLogin(res.data.token);
      }
    } catch (e) {
      setMessage(e.response?.data?.message || "Błąd");
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegister ? "Rejestracja" : "Logowanie"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Login"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          placeholder="Hasło"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn" type="submit">{isRegister ? "Zarejestruj" : "Zaloguj"}</button>
      </form>
      <button className="switch-btn" onClick={() => setIsRegister(!isRegister)}>
        {isRegister
          ? "Masz konto? Zaloguj się"
          : "Nie masz konta? Zarejestruj się"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

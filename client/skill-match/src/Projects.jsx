import React, { useEffect, useState } from "react";
import api from "./api";

export default function Projects({ token }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    skillsRequired: "",
  });
  const [message, setMessage] = useState("");

  const fetchProjects = () => {
    api.get("/projects").then((res) => setProjects(res.data));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = () => {
    const payload = {
      title: form.title,
      description: form.description,
      skillsRequired: form.skillsRequired
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    api
      .post("/projects", payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMessage("Projekt dodany!");
        setForm({ title: "", description: "", skillsRequired: "" });
        fetchProjects();
      })
      .catch(() => setMessage("Błąd tworzenia projektu"));
  };

  const handleJoin = (id) => {
    api
      .post(
        `/projects/${id}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setMessage("Dołączono!");
        fetchProjects();
      })
      .catch(() => setMessage("Nie udało się dołączyć"));
  };

  return (
    <div className="p-4">
      <h2>Projekty</h2>

      <div className="form-row">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Tytuł"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Opis"
        />
        <input
          name="skillsRequired"
          value={form.skillsRequired}
          onChange={handleChange}
          placeholder="Wymagane skille (oddzielone przecinkami)"
        />
        <button className="btn" onClick={handleCreate}>Utwórz projekt</button>
      </div>

      <hr />

      {projects.map((proj) => (
        <div key={proj.id} className="border p-2 my-2 rounded">
          <h3>{proj.title}</h3>
          <p>{proj.description}</p>
          <p>
            <b>Wymagane skille:</b> {proj.skillsRequired.join(", ")}
          </p>
          <p>
            <b>Twórca:</b> {proj.owner}
          </p>
          <p>
            <b>Członkowie:</b> {proj.members.join(", ")}
          </p>
          <button className="btn" onClick={() => handleJoin(proj.id)}>Dołącz</button>
        </div>
      ))}

      {message && <p>{message}</p>}
    </div>
  );
}

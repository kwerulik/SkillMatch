import React, { useEffect, useState } from "react";
import api from "./api";

function Profile({ token }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "", skills: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setForm({
          name: res.data.name || "",
          bio: res.data.bio || "",
          skills: (res.data.skills || []).join(", "),
        });
      })
      .catch(() => setMessage("Błąd ładowania profilu"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    const skillsArray = form.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    api
      .put(
        "/profile",
        {
          name: form.name,
          bio: form.bio,
          skills: skillsArray,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setMessage("Profil zapisany!");
        setEditMode(false);
        setProfile({ ...profile, ...form, skills: skillsArray });
      })
      .catch(() => setMessage("Błąd zapisu"));
  };

  if (loading) return <p>Ładowanie profilu...</p>;

  if (!profile) return <p>Brak profilu</p>;

  return (
    <div>
      {editMode ? (
        <>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Imię i nazwisko"
          />
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="O mnie"
          />
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Umiejętności, oddzielone przecinkami"
          />
          <button onClick={handleSave}>Zapisz</button>
          <button onClick={() => setEditMode(false)}>Anuluj</button>
        </>
      ) : (
        <>
          <h2>{profile.name || "Brak imienia"}</h2>
          <p>{profile.bio || "Brak opisu"}</p>
          <p>Umiejętności: {profile.skills?.join(", ") || "Brak"}</p>
          <button onClick={() => setEditMode(true)}>Edytuj profil</button>
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Profile;

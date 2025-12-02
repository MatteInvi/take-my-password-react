import React, { useState } from "react";
import "../ArchiveTable.css";

// Form di creazione/edit dei dati
function ArchiveForm({ dato, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    platform: dato?.platform || "",
    username: dato?.username || "",
    password: dato?.password || "",
    annotation: dato?.annotation || "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const method = dato?.id ? "PUT" : "POST";
    const url = dato?.id
      ? `http://localhost:8080/api/archive/${dato.id}`
      : "http://localhost:8080/api/archive/create";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante la richiesta");
        return res.json();
      })
      .then((data) => onSuccess(data))
      .catch((err) => alert(err.message));
  };

  
  return (
    <form onSubmit={handleSubmit} className="archive-form">
      <div>
        <label>Piattaforma:</label>
        <input
          name="platform"
          value={formData.platform}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Username:</label>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Annotazioni:</label>
        <input
          name="annotation"
          value={formData.annotation}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="button button-add">
        {dato?.id ? "Modifica" : "Crea"}
      </button>
      <button type="button" className="button button-delete" onClick={onCancel}>
        Annulla
      </button>
    </form>
  );
}

export default ArchiveForm;

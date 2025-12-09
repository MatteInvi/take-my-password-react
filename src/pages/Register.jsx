import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../register.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  //Chiamata post per salvare i dati dell'utente registrato

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(
        "https://take-my-password-1.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        setErrorMsg(errorText || "Errore durante la registrazione");
      } else {
        setSuccessMsg(
          "Registrazione completata! Controlla la mail per confermare"
        );
        setTimeout(() => navigate("/login"), 2500);
      }
    } catch (err) {
      setErrorMsg("Impossibile contattare il server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-box" onSubmit={handleSubmit}>
        <h2>Crea il tuo account</h2>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        {successMsg && <p className="success-msg">{successMsg}</p>}

        <div className="input-group">
          <label>Nome</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            required
            autoComplete="given-name"
          />
        </div>

        <div className="input-group">
          <label>Cognome</label>
          <input
            name="surname"
            value={form.surname}
            onChange={handleChange}
            type="text"
            required
            autoComplete="family-name"
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            required
            autoComplete="email"
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            required
            autoComplete="new-password"
          />
        </div>

        <button id="register-button" disabled={loading} type="submit">
          {loading ? "Registrazione in corso..." : "Registrati"}
        </button>

        <p className="register-footer">
          Hai già un account?{" "}
          <span onClick={() => navigate("/login")}>Accedi</span>
        </p>
      </form>
    </div>
  );
}

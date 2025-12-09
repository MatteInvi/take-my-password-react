import React, { useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import "../Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Chiamata post al back-end con ritorno del token in caso di successo
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      
      if (!res.ok){
        // 1. Leggi il corpo della risposta.
        // Assumiamo che il backend restituisca un JSON anche in caso di errore.
        const errorBody = await res.json();

        // 2. Determina quale campo contiene il messaggio di errore
        // (potrebbe essere 'message', 'error', o 'detail' a seconda del backend).
        const errorMessage =
          errorBody.message ||
          errorBody.error ||
          "Errore sconosciuto durante il login.";

        // 3. Lancia l'eccezione con lo stato HTTP e il messaggio dal backend.
        throw new Error(`Errore: ${errorMessage}`);
      }  
      const data = await res.json();
      localStorage.setItem("token", data.token); 
      navigate("/archive"); 
    } catch (err) {
      setError(err.message);
    }
  };

  // Pagina di login
  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {error && <p className="login-error">{error}</p>}
      <form className="login-form" onSubmit={handleLogin}>
        <label>Username:</label>
        <input
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="button-login">
          Login
        </button>
      </form>
      <p>
        <Link id="password-recovery" to="/reset-password">
          Recupera password
        </Link>
      </p>
    </div>
  );
}

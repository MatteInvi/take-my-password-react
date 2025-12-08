import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ConfirmResetPassword = () => {
  const query = useQuery();
  const token = query.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://localhost:8080/api/auth"; 

  useEffect(() => {
    if (!token) {
      setError("Token di reset password non trovato nella URL.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Le password non corrispondono.");
      return;
    }

    if (!token) {
      setError("Token non valido o mancante.");
      return;
    }

    setLoading(true);


    const url = `${API_BASE_URL}/reset-password/confirm?token=${encodeURIComponent(
      token
    )}`;
    const requestBody = {
      newPassword: newPassword,
    };

    try {
      const response = await axios.post(url, requestBody);
      setMessage(response.data);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const errorMessage =
        err.response?.data || "Si è verificato un errore sconosciuto.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!token && !error) {
    return <p>Caricamento...</p>;
  }

  if (error && !loading) {
    return (
      <div
        style={{
          maxWidth: "400px",
          margin: "auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <h2>Reset Password</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "#2c2c2c",
        color: "whitesmoke",
        borderRadius: "5px",
      }}
    >
      <h2>Imposta Nuova Password</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="new-password"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Nuova Password:
          </label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="confirm-password"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Conferma Password:
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !newPassword || newPassword !== confirmPassword}
          style={{
            padding: "10px 15px",
            backgroundColor: loading ? "#aaa" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Invio..." : "Resetta Password"}
        </button>
      </form>
      {message && (
        <p style={{ color: "green", marginTop: "15px" }}>{message}</p>
      )}
      {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
    </div>
  );
};

export default ConfirmResetPassword;

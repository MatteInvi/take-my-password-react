import React, { useState } from "react";
import axios from "axios";

const RequestResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const API_BASE_URL = "http://localhost:8080/api/auth";

  //Chiamata post al back-end con invio email di recupero password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const url = `${API_BASE_URL}/reset-password?email=${encodeURIComponent(
      email
    )}`;
    try {
      const result = await axios.post(url);

      setMessage(result.data);
      setEmail("");
    } catch (err) {
      const errorMessage = err.response?.data || "Si è verifcato un errore.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "#2c2c2c",
        color: "white",
        borderRadius: "5px",
      }}
    >
      <h2>Richiesta Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 15px",
            backgroundColor: loading ? "#aaa" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Invio..." : "Invia Email di Reset"}
        </button>
      </form>
      {message && (
        <p style={{ color: "green", marginTop: "15px" }}>{message}</p>
      )}
      {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
    </div>
  );
};

export default RequestResetPassword;

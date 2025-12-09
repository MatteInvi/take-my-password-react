import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../ConfirmMail.css";

const ConfirmMail = () => {
  const [message, setMessage] = useState("Verifica in corso...");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Token mancante o non valido.");
      setLoading(false);
      return;
    }

    fetch(
      `https://take-my-password-1.onrender.com/api/auth/confirm-email?token=${token}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Token non valido o già confermato");
        return res.text();
      })
      .then(() => {
        setMessage(
          "Email verificata con successo! Ora puoi effettuare il login."
        );
      })
      .catch((err) => {
        console.error(err);
        setMessage("" + err);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="confirm-wrapper">
      <div className="confirm-card">
        {loading ? (
          <h2>⏳ Verifica in corso...</h2>
        ) : (
          <>
            <h2>{message}</h2>
            <button
              className="confirm-button"
              onClick={() => navigate("/login")}
            >
              Vai al Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmMail;

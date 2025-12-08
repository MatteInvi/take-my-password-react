import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div>
        <ul className="nav-list">
          <li
            className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
          >
            <Link className="nav-link" to="/archive">
              Home
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <ul className="nav-list">
          <li
            className={`nav-item ${
              location.pathname === "/login" ? "active" : ""
            }`}
          >
            {isLogged ? (
              <button id="logout-button" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <Link className="nav-link" to="/login">
                Login
              </Link>
            )}
          </li>
          <li className="nav-item">
            {isLogged ? (
              null
            ) : (
              <Link className="nav-link" to="/register">
                Registrati
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

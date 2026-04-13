import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const initial = user?.name?.[0]?.toUpperCase() || "U";

  return (
    <nav className="navbar navbar-expand-lg gc-navbar fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src="/logo.png" alt="Logo" style={{ height: "42px" }} />
          GastroCare
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setShow(!show)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${show ? "show" : ""}`}>
          <ul className="navbar-nav mx-auto gap-1">
            {[
              ["/", "Home"],
              ["/about", "About"],
              ["/chatbot", "AI Chat"],
              ["/emergency", "Emergency"],
              ["/contact", "Contact"],
            ].map(([path, label]) => (
              <li className="nav-item" key={path}>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  to={path}
                  onClick={() => setShow(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            {user ? (
              <div className="dropdown">
                <button
                  className="gc-nav-avatar dropdown-toggle border-0"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    background: "var(--gc-accent)",
                    color: "var(--gc-primary-dark)",
                  }}
                >
                  {user.profile?.profilePicture ? (
                    <img src={user.profile.profilePicture} alt="" />
                  ) : (
                    initial
                  )}
                </button>
                <ul className="dropdown-menu dropdown-menu-end gc-dropdown">
                  <li>
                    <span className="dropdown-item-text text-muted small fw-semibold">
                      {user.name}
                    </span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/dashboard"
                      onClick={() => setShow(false)}
                    >
                      <i className="bi bi-grid me-2" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/profile"
                      onClick={() => setShow(false)}
                    >
                      <i className="bi bi-person me-2" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/chatbot"
                      onClick={() => setShow(false)}
                    >
                      <i className="bi bi-robot me-2" />
                      AI Chat
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-light btn-sm px-3"
                  onClick={() => setShow(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-sm px-3 fw-semibold"
                  style={{
                    background: "var(--gc-accent)",
                    color: "var(--gc-primary-dark)",
                  }}
                  onClick={() => setShow(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;

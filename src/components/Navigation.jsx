import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

function Navigation() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="site-header">
      {/* 1. TOP GREEN BAR */}
      <div className="top-bar bg-success text-white py-2">
        <div className="container-fluid px-3 d-flex justify-content-between align-items-center">
          <div className="top-header-left small text-truncate">
            <i className="bi bi-envelope me-2"></i> ranunegi407@gmail.coms
            <span className="mx-3 d-none d-md-inline">|</span>
            <span className="d-none d-md-inline">
              <i className="bi bi-phone me-2"></i> +91 80910-18394
            </span>
          </div>
          <div className="top-header-right small fw-bold text-nowrap">
            ♻️ Clean India Mission
          </div>
        </div>
      </div>

      {/* 2. WHITE HEADER BOX WRAPPER */}
      <div className="main-header-wrapper bg-white">
        <div className="container-fluid px-0">
          <div className="header-box bg-white shadow-sm">
            <nav className="navbar navbar-expand-lg navbar-light py-0">
              <div className="container-fluid px-3 py-2 d-flex align-items-center justify-content-between">
                <NavLink className="navbar-brand fw-bold text-brand fs-3 py-0" to="/">
                  Environs
                </NavLink>

                <button
                  className="navbar-toggler border-0"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navMenu"
                  aria-controls="navMenu"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navMenu">
                  <ul className="navbar-nav ms-auto align-items-center">
                    <li className="nav-item px-2">
                      <NavLink
                        to="/"
                        end
                        className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-primary' : 'text-dark'}`}
                      >
                        Home
                      </NavLink>
                    </li>
                    <li className="nav-item px-2">
                      <NavLink
                        to="/about"
                        className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-primary' : 'text-dark'}`}
                      >
                        About
                      </NavLink>
                    </li>
                    <li className="nav-item px-2">
                      <NavLink
                        to="/services"
                        className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-primary' : 'text-dark'}`}
                      >
                        Services
                      </NavLink>
                    </li>
                    <li className="nav-item px-2">
                      <NavLink
                        to="/causes"
                        className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-primary' : 'text-dark'}`}
                      >
                        Causes
                      </NavLink>
                    </li>

                    {/* Dropdown Pages */}
                    <li
                      className="nav-item dropdown px-2"
                      onMouseEnter={() => setShowDropdown(true)}
                      onMouseLeave={() => setShowDropdown(false)}
                    >
                      <a
                        className={`nav-link dropdown-toggle fw-semibold text-dark ${showDropdown ? 'show' : ''}`}
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded={showDropdown}
                      >
                        Pages
                      </a>
                      <ul className={`dropdown-menu border-0 shadow-lg rounded-3 mt-0 ${showDropdown ? 'show' : ''}`}>
                        <li><Link className="dropdown-item py-2 px-4" to="/events">Events</Link></li>
                        <li><Link className="dropdown-item py-2 px-4" to="/gallery">Gallery</Link></li>
                        <li><Link className="dropdown-item py-2 px-4" to="/volunteer">Volunteer</Link></li>
                        <li><Link className="dropdown-item py-2 px-4" to="/donation">Donation</Link></li>
                      </ul>
                    </li>

                    <li className="nav-item px-2">
                      <NavLink
                        to="/blog"
                        className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-primary' : 'text-dark'}`}
                      >
                        Blog
                      </NavLink>
                    </li>
                    <li className="nav-item px-2">
                      <NavLink
                        to="/contact"
                        className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-primary' : 'text-dark'}`}
                      >
                        Contact
                      </NavLink>
                    </li>
                  </ul>

                  <div className="ms-lg-4 mt-3 mt-lg-0">
                    <NavLink to="/auth" className="btn btn-primary px-5 fw-bold rounded-pill shadow-sm py-2">
                      Login
                    </NavLink>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navigation;

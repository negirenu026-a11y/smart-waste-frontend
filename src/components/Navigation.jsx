import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const close = () => { setDrawerOpen(false); setPagesOpen(false); };

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/causes', label: 'Causes' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ];

  const pageLinks = [
    { to: '/events', label: 'Events' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/volunteer', label: 'Volunteer' },
    { to: '/donation', label: 'Donation' },
  ];

  return (
    <>
      <style>{`
        :root {
          --green: #28a745;
          --green-dark: #1e7e34;
          --brand: #f6ac3b;
          --blue: #007bff;
          --blue-dark: #0056b3;
          --dark: #1f2a3d;
          --topbar-h: 42px;
          --navbar-h: 70px;
        }

        /* ── body offset ── */
        body { padding-top: calc(var(--topbar-h) + var(--navbar-h)); }

        /* ══════════════════════════════
           TOP GREEN BAR
        ══════════════════════════════ */
        .nb-topbar {
          position: fixed; top: 0; left: 0; right: 0;
          height: var(--topbar-h);
          background: var(--green);
          color: #fff; font-size: 0.73rem;
          display: flex; align-items: center;
          padding: 0 1.5rem;
          justify-content: space-between;
          z-index: 1100;
          width:100%;
        }
        .nb-topbar .contacts { display: flex; gap: 1.25rem; align-items: center; }
        .nb-topbar .contacts span { display: flex; gap: 0.3rem; align-items: center; opacity: 0.9; }
        .nb-topbar .mission { font-weight: 700; letter-spacing: 0.03em; white-space: nowrap; }
        @media (max-width: 560px) {
          .nb-topbar .contacts span:last-child { display: none; }
        }

        /* ══════════════════════════════
           MAIN NAVBAR
        ══════════════════════════════ */
        .nb-navbar {
          position: fixed;
          top: var(--topbar-h); left: 0; right: 0;
          height: var(--navbar-h);
          background: #fff;
          z-index: 1050;
          transition: box-shadow 0.25s;
        }
        .nb-navbar.scrolled { box-shadow: 0 2px 18px rgba(0,0,0,0.09); }
        .nb-navbar:not(.scrolled) { box-shadow: 0 1px 4px rgba(0,0,0,0.05); }

        .nb-inner {
          width: 100%; 
          padding: 0 1.5rem;
          height: 100%;
          display: flex; align-items: center; justify-content: space-between;
        }

        /* Brand */
        .nb-brand {
          font-size: 1.65rem; font-weight: 800;
          color: var(--brand) !important; text-decoration: none;
          letter-spacing: -0.03em; flex-shrink: 0;
        }
        .nb-brand:hover { color: var(--green) !important; }

        /* ── Desktop nav links ── */
        .nb-desktop {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1.5rem;
        }
        .nb-links {
          display: flex; align-items: center; gap: 0.5rem;
          list-style: none; margin: 0; padding: 0;
        }
        .nb-links .nb-link {
          display: block; padding: 0.42rem 0.7rem;
          font-size: 0.855rem; font-weight: 600;
          color: var(--dark); text-decoration: none;
          border-radius: 6px;
          transition: color 0.16s, background 0.16s;
          white-space: nowrap;
        }
        .nb-links .nb-link:hover,
        .nb-links .nb-link.active { color: var(--brand); background: transparent; }

        /* Dropdown */
        .nb-dropdown { position: relative; }
        .nb-drop-btn {
          display: flex; align-items: center; gap: 0.28rem;
          padding: 0.42rem 0.7rem;
          font-size: 0.855rem; font-weight: 600;
          color: var(--dark); background: none; border: none;
          border-radius: 6px; cursor: pointer;
          transition: color 0.16s, background 0.16s;
          white-space: nowrap;
        }
        .nb-drop-btn svg { transition: transform 0.2s; }
        .nb-dropdown.open .nb-drop-btn svg { transform: rotate(180deg); }
        .nb-drop-btn:hover,
        .nb-dropdown.open .nb-drop-btn { color: var(--brand); background: transparent; }

        .nb-drop-panel {
          position: absolute; top: calc(100% + 8px);
          left: 50%; transform: translateX(-50%) translateY(-4px);
          min-width: 160px; background: #fff;
          border-radius: 10px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.12);
          padding: 0.35rem 0;
          opacity: 0; pointer-events: none;
          transition: opacity 0.18s, transform 0.18s;
        }
        .nb-dropdown.open .nb-drop-panel {
          opacity: 1; pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }
        .nb-drop-panel a {
          display: block; padding: 0.5rem 1rem;
          font-size: 0.835rem; font-weight: 500;
          color: var(--dark); text-decoration: none;
          transition: background 0.14s, color 0.14s;
        }
        .nb-drop-panel a:hover { background: rgba(246,172,59,0.09); color: var(--brand); }

        /* Login btn */
        .nb-login {
          display: inline-flex; align-items: center;
          padding: 0.6rem 1.8rem;
          background: var(--green); color: #fff !important;
          font-weight: 700; font-size: 0.9rem;
          border-radius: 50px; text-decoration: none;
          flex-shrink: 0; white-space: nowrap;
          box-shadow: 0 4px 12px rgba(40,167,69,0.25);
          transition: all 0.2s ease;
        }
        .nb-login:hover {
          background: var(--green-dark);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(40,167,69,0.35);
        }

        /* Hamburger — visible only on mobile */
        .nb-hamburger {
          display: none;
          flex-direction: column; justify-content: center;
          align-items: center; gap: 5px;
          width: 38px; height: 38px;
          background: none; border: none; cursor: pointer;
          border-radius: 8px; padding: 4px;
          transition: background 0.15s; flex-shrink: 0;
        }
        .nb-hamburger:hover { background: rgba(246,172,59,0.1); }
        .nb-hamburger span {
          display: block; width: 21px; height: 2px;
          background: var(--dark); border-radius: 2px;
          transition: transform 0.24s, opacity 0.24s, width 0.24s;
        }
        .nb-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nb-hamburger.open span:nth-child(2) { opacity: 0; width: 0; }
        .nb-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        @media (max-width: 900px) {
          .nb-desktop { display: none !important; }
          .nb-hamburger { display: flex; }
        }

        /* ══════════════════════════════
           RIGHT SLIDE DRAWER (mobile)
        ══════════════════════════════ */
        .nb-overlay {
          position: fixed; inset: 0;
          background: rgba(15,20,30,0.45);
          backdrop-filter: blur(3px);
          z-index: 1200;
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s;
        }
        .nb-overlay.show { opacity: 1; pointer-events: auto; }

        .nb-drawer {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: min(300px, 82vw);
          background: #fff;
          z-index: 1300;
          display: flex; flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.32s cubic-bezier(.4,0,.2,1);
          box-shadow: -8px 0 40px rgba(0,0,0,0.15);
        }
        .nb-drawer.open { transform: translateX(0); }

        /* Drawer header */
        .nb-drawer-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.1rem 0.8rem;
          border-bottom: 1px solid #f0f2f5;
          flex-shrink: 0;
        }
        .nb-drawer-head .brand {
          font-size: 1.45rem; font-weight: 800;
          color: var(--brand); text-decoration: none; letter-spacing: -0.03em;
        }
        .nb-drawer-close {
          width: 32px; height: 32px;
          background: #f4f5f7; border: none; cursor: pointer;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; color: #6b7a8d;
          transition: background 0.15s, color 0.15s;
        }
        .nb-drawer-close:hover { background: #ffe8c0; color: var(--brand); }

        /* Drawer nav */
        .nb-drawer-nav {
          flex: 1; overflow-y: auto;
          padding: 0.6rem 0;
          scrollbar-width: thin;
          scrollbar-color: #e0e3e8 transparent;
        }
        .nb-drawer-link {
          display: flex; align-items: center;
          padding: 0.7rem 1.25rem;
          font-size: 0.9rem; font-weight: 600;
          color: var(--dark); text-decoration: none;
          border-right: 3px solid transparent;
          transition: background 0.14s, color 0.14s, border-color 0.14s;
        }
        .nb-drawer-link:hover { background: rgba(246,172,59,0.07); color: var(--brand); }
        .nb-drawer-link.active {
          background: rgba(40,167,69,0.07);
          color: var(--green);
          border-right-color: var(--green);
          font-weight: 700;
        }

        .nb-drawer-divider { height: 1px; background: #f0f2f5; margin: 0.4rem 1.25rem; }

        /* Pages accordion in drawer */
        .nb-acc-btn {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 0.7rem 1.25rem;
          background: none; border: none; cursor: pointer;
          font-size: 0.9rem; font-weight: 600; color: var(--dark);
          transition: background 0.14s, color 0.14s;
        }
        .nb-acc-btn:hover { background: rgba(246,172,59,0.07); color: var(--brand); }
        .nb-acc-btn .chevron {
          font-size: 0.62rem; opacity: 0.45;
          transition: transform 0.22s;
        }
        .nb-acc-btn.open .chevron { transform: rotate(180deg); }

        .nb-acc-body {
          overflow: hidden; max-height: 0;
          transition: max-height 0.28s cubic-bezier(.4,0,.2,1);
        }
        .nb-acc-body.open { max-height: 220px; }

        .nb-acc-link {
          display: block;
          padding: 0.55rem 1.25rem 0.55rem 2.2rem;
          font-size: 0.845rem; font-weight: 500;
          color: #5a6475; text-decoration: none;
          transition: background 0.14s, color 0.14s;
        }
        .nb-acc-link:hover { background: rgba(246,172,59,0.08); color: var(--brand); }

        /* Drawer footer CTA */
        .nb-drawer-foot {
          padding: 0.85rem 1.1rem;
          border-top: 1px solid #f0f2f5; flex-shrink: 0;
        }
        .nb-drawer-login {
          display: flex; align-items: center; justify-content: center;
          width: 100%; padding: 0.65rem;
          background: var(--green); color: #fff !important;
          font-weight: 700; font-size: 0.88rem;
          border-radius: 10px; text-decoration: none;
          box-shadow: 0 2px 10px rgba(40,167,69,0.22);
          transition: background 0.18s, transform 0.15s;
        }
        .nb-drawer-login:hover { background: var(--green-dark); transform: translateY(-1px); }
      `}</style>

      {/* ── TOP GREEN BAR ── */}
      <div className="nb-topbar">
        <div className="contacts">
          <span><i className="bi bi-envelope"></i> ranunegi407@gmail.com</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span><i className="bi bi-phone"></i> +91 80910-18394</span>
        </div>
        <span className="mission">♻️ Clean India Mission</span>
      </div>

      {/* ── MAIN NAVBAR ── */}
      <div className={`nb-navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nb-inner">
          <NavLink className="nb-brand" to="/">Environs</NavLink>

          {/* Desktop nav */}
          <div className="nb-desktop">
            <ul className="nb-links">
              {navLinks.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink to={to} end={end} className={({ isActive }) => `nb-link${isActive ? ' active' : ''}`}>
                    {label}
                  </NavLink>
                </li>
              ))}
              {/* Pages dropdown */}
              <li>
                <div
                  className={`nb-dropdown${showDropdown ? ' open' : ''}`}
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <button className="nb-drop-btn">
                    Pages
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M2 3.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div className="nb-drop-panel">
                    {pageLinks.map(({ to, label }) => (
                      <Link key={to} to={to} onClick={() => setShowDropdown(false)}>{label}</Link>
                    ))}
                  </div>
                </div>
              </li>
            </ul>
            <NavLink to="/auth" className="nb-login">Login</NavLink>
          </div>

          {/* Hamburger (mobile) */}
          <button
            className={`nb-hamburger${drawerOpen ? ' open' : ''}`}
            onClick={() => setDrawerOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* ── OVERLAY ── */}
      <div className={`nb-overlay${drawerOpen ? ' show' : ''}`} onClick={close} />

      {/* ── RIGHT DRAWER ── */}
      <div className={`nb-drawer${drawerOpen ? ' open' : ''}`} role="dialog" aria-modal="true">
        {/* Header */}
        <div className="nb-drawer-head">
          <NavLink className="brand" to="/" onClick={close}>Environs</NavLink>
          <button className="nb-drawer-close" onClick={close} aria-label="Close">✕</button>
        </div>

        {/* Nav links */}
        <nav className="nb-drawer-nav">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nb-drawer-link${isActive ? ' active' : ''}`}
              onClick={close}
            >
              {label}
            </NavLink>
          ))}

          <div className="nb-drawer-divider" />

          {/* Pages accordion */}
          <button
            className={`nb-acc-btn${pagesOpen ? ' open' : ''}`}
            onClick={() => setPagesOpen(o => !o)}
          >
            Pages <span className="chevron">▼</span>
          </button>
          <div className={`nb-acc-body${pagesOpen ? ' open' : ''}`}>
            {pageLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="nb-acc-link" onClick={close}>{label}</Link>
            ))}
          </div>
        </nav>

        {/* Footer CTA */}
        <div className="nb-drawer-foot">
          <NavLink to="/auth" className="nb-drawer-login" onClick={close}>Login</NavLink>
        </div>
      </div>
    </>
  );
}

export default Navigation;
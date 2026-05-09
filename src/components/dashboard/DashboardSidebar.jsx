import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { panelConfig } from '../../utils/dashboardData';
import api from '../../utils/api';

const DashboardSidebar = ({ role, isOpen, onClose }) => {
    const navigate = useNavigate();
    const config = panelConfig[role] || panelConfig.citizen;
    const accentColor = "#10b981"; // Premium Green

    const handleLogout = async () => {
        try {
            await api.post("/logout");
        } catch (err) {
            console.error("Logout API failed", err);
        } finally {
            localStorage.removeItem("wastewise-user");
            navigate("/auth", { replace: true });
        }
    };

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose} />
            <aside className={`dashboard-sidebar ${isOpen ? 'is-open' : ''}`}>
                <div className="dashboard-sidebar__head">
                    <div className="dashboard-sidebar__logo" style={{ background: accentColor }}>
                        <i className={`fas ${role === "admin" ? "fa-shield-alt" : role === "mc" ? "fa-city" : "fa-leaf"}`} />
                    </div>
                    <div>
                        <h4 className="dashboard-sidebar__title">WasteWise</h4>
                        <p className="dashboard-sidebar__subtitle">{role?.toUpperCase()} PANEL</p>
                    </div>
                    <button className="sidebar-close-btn d-lg-none" onClick={onClose}>
                        <i className="fas fa-times" />
                    </button>
                </div>

                <nav className="dashboard-subnav">
                    {config.sections.map((section) => (
                        <NavLink
                            key={section.id}
                            to={`/${role}/${section.path}`}
                            className={({ isActive }) => `dashboard-subnav__item ${isActive ? "is-active" : ""}`}
                            style={({ isActive }) => isActive ? { background: accentColor, color: "#fff" } : {}}
                            end={section.path === ''}
                            onClick={() => window.innerWidth < 992 && onClose()}
                        >
                            <i className={`fas ${section.icon}`} />
                            <span>{section.label}</span>
                        </NavLink>
                    ))}
                </nav>


                <div className="dashboard-sidebar__actions">
                    <button className="dashboard-subnav__item dashboard-subnav__item--logout" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default DashboardSidebar;

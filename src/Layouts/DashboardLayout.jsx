import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import './DashboardLayout.css';

const DashboardLayout = ({ role }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Apply theme on mount
        const savedTheme = localStorage.getItem('wastewise-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        const storedUser = localStorage.getItem("wastewise-user");

        if (!storedUser) {
            navigate("/auth", { replace: true });
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } catch (error) {
            navigate("/auth", { replace: true });
        } finally {
            setLoading(false);
        }
    }, [role, navigate]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    if (loading) return <div className="dashboard-loading">Loading...</div>;

    return (
        <div className={`dashboard-shell ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <DashboardSidebar role={user?.role || role} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="dashboard-main">
                <div className="welcome-marquee">
                    <marquee scrollamount="5">
                        ♻️ Welcome to WasteWise Management Platform — Working towards a cleaner and greener environment ♻️
                    </marquee>
                </div>
                <DashboardNavbar user={user} onToggleSidebar={toggleSidebar} />
                <div className="dashboard-content" onClick={() => isSidebarOpen && setIsSidebarOpen(false)}>
                    <Outlet context={{ user }} />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;

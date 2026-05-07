// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { SharedSpinner } from "../components/Layout";
// import {
//     defaultSectionByPanel,
//     panelConfig
// } from "../dashboard/dashboardData";
// import { AdminModuleView } from "../dashboard/AdminModules";
// import { McModuleView } from "../dashboard/McModules";
// // import { CitizenModuleView } from "../dashboard/CitizenModules";
// import { SettingsModule } from "../dashboard/SettingsModule";
// import './Dashboard.css';

// const API_BASE_URL = "http://localhost:4000/api";

// /* ─── Sidebar nav ─────────────────────────────────────────────────────────── */
// function Sidebar({ activePanel, activeSection, onSectionChange, onLogout, panelData }) {
//     const accent = "#10b981"; // Modern Eco-friendly Green

//     return (
//         <aside className="dashboard-sidebar">
//             <div className="dashboard-sidebar__head">
//                 <div className="dashboard-sidebar__logo" style={{ background: accent }}>
//                     <i className={`fas ${activePanel === 'admin' ? 'fa-shield-alt' : activePanel === 'mc' ? 'fa-city' : 'fa-leaf'}`}></i>
//                 </div>
//                 <div>
//                     <h4 className="dashboard-sidebar__title">WasteWise</h4>
//                     <p className="dashboard-sidebar__subtitle">Management System</p>
//                 </div>
//             </div>

//             <nav className="dashboard-subnav">
//                 {panelData.sections.map((section) => (
//                     <button
//                         key={section.id}
//                         className={`dashboard-subnav__item ${activeSection === section.id ? "is-active" : ""}`}
//                         onClick={() => onSectionChange(section.id)}
//                         style={activeSection === section.id ? { background: accent, color: '#fff' } : {}}
//                     >
//                         <i className={`fas ${section.icon}`}></i>
//                         <span>{section.label}</span>
//                     </button>
//                 ))}
//             </nav>

//             <div className="dashboard-sidebar__actions">
//                 <button
//                     className={`dashboard-subnav__item ${activeSection === 'settings' ? "is-active" : ""}`}
//                     onClick={() => onSectionChange('settings')}
//                     style={activeSection === 'settings' ? { background: accent, color: '#fff' } : {}}
//                 >
//                     <i className="fas fa-cog"></i>
//                     <span>Settings</span>
//                 </button>
//                 <button className="dashboard-subnav__item dashboard-subnav__item--logout" onClick={onLogout}>
//                     <i className="fas fa-sign-out-alt"></i>
//                     <span>Logout</span>
//                 </button>
//             </div>
//         </aside>
//     );
// }

// /* ─── Top utility header ──────────────────────────────────────────────────── */
// function TopBar({ panelTitle, sectionLabel, user, notifications }) {
//     const [showNotif, setShowNotif] = useState(false);

//     return (
//         <div className="dashboard-topbar">
//             <div className="dashboard-topbar__left">
//                 <div className="search-bar">
//                     <i className="fas fa-search"></i>
//                     <input type="text" placeholder="Search areas, complaints, workers..." />
//                 </div>
//             </div>
//             <div className="dashboard-topbar__right">
//                 <div className="position-relative">
//                     <button className="dashboard-icon-button" onClick={() => setShowNotif(!showNotif)}>
//                         <i className="fas fa-bell"></i>
//                         {notifications.length > 0 && <span className="dashboard-icon-button__badge">{notifications.length}</span>}
//                     </button>
//                     {showNotif && (
//                         <div className="dashboard-notif-dropdown shadow">
//                             <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
//                                 <h6 className="m-0 fw-bold">Recent Updates</h6>
//                                 <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={() => setShowNotif(false)}>Close</button>
//                             </div>
//                             <div className="notif-list">
//                                 {notifications.length > 0 ? notifications.map((n, i) => (
//                                     <div key={i} className="notif-item p-3 border-bottom hover-bg-light transition-all">
//                                         <div className="d-flex gap-2">
//                                             <i className="fas fa-info-circle text-primary mt-1"></i>
//                                             <div>
//                                                 <p className="mb-0 small fw-bold">{n.title}</p>
//                                                 <span className="text-muted" style={{fontSize: '0.7rem'}}>{n.time}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )) : <div className="p-4 text-center text-muted small">No new notifications</div>}
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <div className="dashboard-topbar__user ms-3">
//                     <div className="dashboard-topbar__avatar" style={{background: '#10b981'}}>
//                         {(user?.fullName || user?.name || 'U')[0].toUpperCase()}
//                     </div>
//                     <div className="dashboard-topbar__user-info">
//                         <span className="dashboard-topbar__user-name">{user?.fullName || user?.name || 'User'}</span>
//                         <span className="dashboard-topbar__user-role">{user?.role || 'citizen'}</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// /* ─── Metric cards ────────────────────────────────────────────────────────── */
// function MetricCards({ metrics, accent }) {
//     return (
//         <div className="dashboard-metrics">
//             {metrics.map((item) => (
//                 <article key={item.label} className="dashboard-card dashboard-card--metric hover-lift">
//                     <div className="dashboard-card__metric-top">
//                         <span className="dashboard-card__metric-icon" style={{ background: `${accent}15`, color: accent }}>
//                             <i className="fas fa-chart-line"></i>
//                         </span>
//                         <span className="dashboard-card__metric-label text-uppercase small fw-bold">{item.label}</span>
//                     </div>
//                     <strong className="dashboard-card__metric-value mt-2">{item.value}</strong>
//                 </article>
//             ))}
//         </div>
//     );
// }

// export default function DashboardPage() {
//     const { role: urlRole } = useParams();
//     const navigate = useNavigate();

//     const [savedUser, setSavedUser] = useState(null);
//     const [authChecked, setAuthChecked] = useState(false);
//     const [loading, setLoading] = useState(true);

//     const [workers, setWorkers] = useState([]);
//     const [complaints, setComplaints] = useState([]);
//     const [tasks, setTasks] = useState([]);
//     const [users, setUsers] = useState([]);
//     const [notifications, setNotifications] = useState([
//         { title: "New Complaint filed in Zone A", time: "5 mins ago" },
//         { title: "Worker Rajesh is now On Duty", time: "12 mins ago" },
//         { title: "System Maintenance at 12 AM", time: "1 hour ago" }
//     ]);

//     useEffect(() => {
//         const stored = localStorage.getItem("wastewise-user");
//         const token = localStorage.getItem("wastewise-token");
//         if (!stored || !token) {
//             navigate("/auth", { replace: true });
//             return;
//         }
//         try {
//             const parsedUser = JSON.parse(stored);
//             setSavedUser(parsedUser);
//             fetchDashboardData(token);
//         } catch {
//             navigate("/auth", { replace: true });
//         }
//         setAuthChecked(true);
//     }, [urlRole, navigate]);

//     const fetchDashboardData = async (token) => {
//         setLoading(true);
//         try {
//             const config = { headers: { Authorization: `Bearer ${token}` } };
//             const [complaintsRes, workersRes, tasksRes] = await Promise.all([
//                 axios.get(`${API_BASE_URL}/complaints`, config),
//                 axios.get(`${API_BASE_URL}/workers`, config),
//                 axios.get(`${API_BASE_URL}/tasks`, config)
//             ]);

//             setComplaints(complaintsRes.data.complaints || []);
//             setWorkers(workersRes.data.workers || []);
//             setTasks(tasksRes.data.tasks || []);

//             if (JSON.parse(localStorage.getItem("wastewise-user")).role === 'admin') {
//                 const usersRes = await axios.get(`${API_BASE_URL}/users`, config);
//                 setUsers(usersRes.data.users || []);
//             }
//         } catch (err) {
//             console.error("Fetch error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const activePanel = savedUser?.role || urlRole || "citizen";
//     const panel = panelConfig[activePanel] || panelConfig.citizen;

//     const [activeSection, setActiveSection] = useState(
//         defaultSectionByPanel[activePanel] || "report"
//     );

//     useEffect(() => {
//         setActiveSection(defaultSectionByPanel[activePanel] || "report");
//     }, [activePanel]);

//     const handleLogout = () => {
//         localStorage.removeItem("wastewise-user");
//         localStorage.removeItem("wastewise-token");
//         navigate("/", { replace: true });
//     };

//     const dynamicMetrics = panel.metrics.map(m => {
//         if (m.label === "Registered MCs") return { ...m, value: users.filter(u => u.userType === 'mc').length };
//         if (m.label === "Active Citizens") return { ...m, value: users.filter(u => u.userType === 'citizen').length };
//         if (m.label === "Open Complaints") return { ...m, value: complaints.filter(c => c.status !== 'Resolved').length };
//         if (m.label === "Workers On Duty") return { ...m, value: workers.length };
//         if (m.label === "Complaints Submitted") return { ...m, value: complaints.length };
//         return m;
//     });

//     const sectionLabel = activeSection === 'settings' 
//         ? 'Settings' 
//         : panel.sections.find(s => s.id === activeSection)?.label || '';

//     const accent = "#10b981"; // Modern Green

//     if (!authChecked || !savedUser) return null;

//     return (
//         <div className="dashboard-shell">
//             {loading && <SharedSpinner />}
//             <Sidebar 
//                 activePanel={activePanel} 
//                 activeSection={activeSection} 
//                 onSectionChange={setActiveSection} 
//                 onLogout={handleLogout} 
//                 panelData={panel} 
//             />
//             <main className="dashboard-main">
//                 <div className="welcome-marquee">
//                     <marquee scrollamount="5">
//                         ♻️ Welcome to WasteWise Management Platform - Working towards a cleaner and greener environment ♻️
//                     </marquee>
//                 </div>
//                 <TopBar 
//                     panelTitle={panel.title} 
//                     sectionLabel={sectionLabel} 
//                     user={savedUser} 
//                     notifications={notifications}
//                 />
//                 <div className="dashboard-content">
//                     {activeSection !== 'settings' && <MetricCards metrics={dynamicMetrics} accent={accent} />}
//                     <div className="dashboard-section-wrap">
//                         {activeSection === 'settings' ? <SettingsModule savedUser={savedUser} /> :
//                          activePanel === 'admin' ? <AdminModuleView sectionId={activeSection} users={users} complaints={complaints} workers={workers} setUsers={setUsers} setComplaints={setComplaints} setWorkers={setWorkers} /> :
//                          activePanel === 'mc' ? <McModuleView sectionId={activeSection} workers={workers} complaints={complaints} tasks={tasks} setWorkers={setWorkers} setComplaints={setComplaints} setTasks={setTasks} /> :
//                          <CitizenModuleView sectionId={activeSection} savedUser={savedUser} complaints={complaints} setComplaints={setComplaints} />}
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }

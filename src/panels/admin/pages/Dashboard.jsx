import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import api from '../../../utils/api';

const STATUS_COLORS = {
    Pending: "#ef4444",
    "In Process": "#f59e0b",
    Resolved: "#10b981",
};

const AdminDashboard = () => {
    const { user } = useOutletContext();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        mcs: 0, citizens: 0, totalComplaints: 0, pendingComplaints: 0,
        resolvedComplaints: 0, totalTasks: 0, activeTasks: 0, totalWorkers: 0,
        totalAreas: 0, pendingReports: 0
    });
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [complaintsByStatus, setComplaintsByStatus] = useState({});
    const [topMCs, setTopMCs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const [usersRes, complaintsRes, tasksRes, workersRes, areasRes, reportsRes] = await Promise.all([
                    api.get("/users"),
                    api.get("/complaints"),
                    api.get("/tasks"),
                    api.get("/workers"),
                    api.get("/areas"),
                    api.get("/reports")
                ]);

                const users = usersRes.data.users || [];
                const complaints = complaintsRes.data.complaints || [];
                const tasks = tasksRes.data.tasks || [];
                const workers = workersRes.data.workers || [];
                const areas = areasRes.data.areas || [];
                const reports = reportsRes.data.reports || [];

                const mcs = users.filter(u => u.role === 'mc' || u.userType === 'mc');
                const citizens = users.filter(u => u.role === 'citizen' || u.userType === 'citizen');

                // Complaint status breakdown
                const statusCount = { Pending: 0, "In Process": 0, Resolved: 0 };
                complaints.forEach(c => {
                    const s = c.status || "Pending";
                    if (statusCount[s] !== undefined) statusCount[s]++;
                });
                setComplaintsByStatus(statusCount);

                // Top MCs by complaint count
                const mcComplaintCount = {};
                complaints.forEach(c => {
                    const mcName = c.city || "Unknown";
                    mcComplaintCount[mcName] = (mcComplaintCount[mcName] || 0) + 1;
                });
                const sortedMCs = Object.entries(mcComplaintCount)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([city, count]) => ({ city, count }));
                setTopMCs(sortedMCs);

                setStats({
                    mcs: mcs.length,
                    citizens: citizens.length,
                    totalComplaints: complaints.length,
                    pendingComplaints: statusCount.Pending,
                    resolvedComplaints: statusCount.Resolved,
                    totalTasks: tasks.length,
                    activeTasks: tasks.filter(t => t.status !== 'Completed' && t.status !== 'Resolved').length,
                    totalWorkers: workers.length,
                    totalAreas: areas.length,
                    pendingReports: reports.filter(r => r.status === 'Pending').length
                });

                setRecentComplaints(complaints.slice(0, 6));
            } catch (err) {
                console.error("Failed to fetch admin metrics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const quickActions = [
        { label: "Manage MCs", icon: "fa-building", color: "#8b5cf6", path: "/admin/manage-mc" },
        { label: "Manage Citizens", icon: "fa-users", color: "#3b82f6", path: "/admin/manage-citizen" },
        { label: "View Complaints", icon: "fa-file-invoice", color: "#ef4444", path: "/admin/manage-complaints" },
        { label: "Manage Areas", icon: "fa-map-marked-alt", color: "#10b981", path: "/admin/manage-areas" },
        { label: "View Reports", icon: "fa-chart-bar", color: "#f59e0b", path: "/admin/reports" },
        { label: "View Tasks", icon: "fa-tasks", color: "#06b6d4", path: "/admin/manage-tasks" }
    ];

    const resolutionRate = stats.totalComplaints > 0
        ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)
        : 0;

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">System Overview</h2>
                <p className="text-muted">Central monitoring and management for waste operations.</p>
            </header>

            {/* ── Metric Cards ────────────────────────────────────────── */}
            <div className="row g-3 mb-4">
                {[
                    { label: "Registered MCs", value: stats.mcs, icon: "fa-building", color: "#8b5cf6", sub: "Municipal Corps" },
                    { label: "Active Citizens", value: stats.citizens, icon: "fa-users", color: "#3b82f6", sub: "Registered users" },
                    { label: "Total Complaints", value: stats.totalComplaints, icon: "fa-file-invoice", color: "#ef4444", sub: `${stats.pendingComplaints} pending` },
                    { label: "Resolution Rate", value: `${resolutionRate}%`, icon: "fa-chart-line", color: "#10b981", sub: `${stats.resolvedComplaints} resolved` },
                    { label: "Active Tasks", value: stats.activeTasks, icon: "fa-tasks", color: "#06b6d4", sub: `${stats.totalTasks} total` },
                    { label: "Workers", value: stats.totalWorkers, icon: "fa-hard-hat", color: "#f97316", sub: "Field staff" },
                    { label: "Operational Areas", value: stats.totalAreas, icon: "fa-map-marked-alt", color: "#14b8a6", sub: "Registered zones" },
                    { label: "Pending Reports", value: stats.pendingReports, icon: "fa-clipboard-check", color: "#f59e0b", sub: "Awaiting review" }
                ].map((m, i) => (
                    <div key={i} className="col-6 col-md-4 col-lg-3">
                        <div className="dashboard-card p-3 shadow-sm border-0 bg-white h-100 hover-lift" style={{ borderRadius: '12px' }}>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="d-flex align-items-center justify-content-center rounded-circle"
                                    style={{ width: 36, height: 36, background: `${m.color}15`, color: m.color, fontSize: '0.9rem' }}>
                                    <i className={`fas ${m.icon}`}></i>
                                </span>
                                <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.65rem', lineHeight: 1.2 }}>{m.label}</span>
                            </div>
                            <h3 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>{loading ? "..." : m.value}</h3>
                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>{m.sub}</small>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Quick Actions ───────────────────────────────────────── */}
            <div className="mb-4">
                <h5 className="fw-bold mb-3">Quick Actions</h5>
                <div className="d-flex gap-3 flex-wrap">
                    {quickActions.map((a, i) => (
                        <button key={i}
                            className="btn d-flex align-items-center gap-2 px-4 py-2 fw-bold shadow-sm border-0"
                            style={{ background: `${a.color}10`, color: a.color, borderRadius: '10px', fontSize: '0.85rem' }}
                            onClick={() => navigate(a.path)}>
                            <i className={`fas ${a.icon}`}></i>
                            {a.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="row g-4">
                {/* ── Complaint Status Breakdown ──────────────────────── */}
                <div className="col-lg-4">
                    <h5 className="fw-bold mb-3">Complaint Breakdown</h5>
                    <div className="dashboard-card p-4 shadow-sm border-0 bg-white" style={{ borderRadius: '12px' }}>
                        {/* Visual bar breakdown */}
                        <div className="mb-4">
                            <div className="d-flex rounded overflow-hidden" style={{ height: '12px' }}>
                                {Object.entries(complaintsByStatus).map(([status, count]) => (
                                    <div key={status}
                                        style={{
                                            width: stats.totalComplaints > 0 ? `${(count / stats.totalComplaints) * 100}%` : '33%',
                                            background: STATUS_COLORS[status] || '#94a3b8',
                                            transition: 'width 0.5s ease'
                                        }}>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {Object.entries(complaintsByStatus).map(([status, count]) => (
                            <div key={status} className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <span className="rounded-circle" style={{ width: 10, height: 10, background: STATUS_COLORS[status], flexShrink: 0 }}></span>
                                    <span className="small fw-semibold">{status}</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fw-bold">{count}</span>
                                    <span className="text-muted small">({stats.totalComplaints > 0 ? Math.round((count / stats.totalComplaints) * 100) : 0}%)</span>
                                </div>
                            </div>
                        ))}

                        <hr className="my-3" />

                        {/* Resolution Ring */}
                        <div className="text-center">
                            <span className="small fw-bold text-muted text-uppercase d-block mb-2" style={{ fontSize: '0.65rem' }}>Overall Resolution</span>
                            <div className="position-relative d-inline-block" style={{ width: 90, height: 90 }}>
                                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3"
                                        strokeDasharray={`${resolutionRate} ${100 - resolutionRate}`}
                                        strokeLinecap="round" />
                                </svg>
                                <div className="position-absolute top-50 start-50 translate-middle fw-bold" style={{ fontSize: '1rem' }}>
                                    {resolutionRate}%
                                </div>
                            </div>
                            <div className="small text-muted mt-1">{stats.resolvedComplaints} of {stats.totalComplaints}</div>
                        </div>
                    </div>
                </div>

                {/* ── Recent Complaints ───────────────────────────────── */}
                <div className="col-lg-8">
                    <h5 className="fw-bold mb-3">Recent Complaints</h5>
                    <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white" style={{ borderRadius: '12px' }}>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4 small fw-bold">Citizen</th>
                                        <th className="small fw-bold">Category</th>
                                        <th className="small fw-bold">City / Zone</th>
                                        <th className="small fw-bold">Status</th>
                                        <th className="pe-4 text-end small fw-bold">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={5} className="text-center py-5">
                                            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                                        </td></tr>
                                    ) : recentComplaints.length === 0 ? (
                                        <tr><td colSpan={5} className="text-center py-5 text-muted small">No complaints found.</td></tr>
                                    ) : (
                                        recentComplaints.map((c) => (
                                            <tr key={c._id} style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/manage-complaints')}>
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                                                            style={{ width: 30, height: 30, background: STATUS_COLORS[c.status] || '#94a3b8', fontSize: '0.7rem', flexShrink: 0 }}>
                                                            {(c.citizenName || "C")[0].toUpperCase()}
                                                        </div>
                                                        <span className="small fw-bold">{c.citizenName || "Citizen"}</span>
                                                    </div>
                                                </td>
                                                <td><span className="badge bg-light text-dark border small">{c.category || c.type}</span></td>
                                                <td className="small text-muted">{c.city}{c.zone ? `, ${c.zone}` : ''}</td>
                                                <td>
                                                    <span className="badge rounded-pill" style={{
                                                        backgroundColor: `${STATUS_COLORS[c.status || 'Pending']}15`,
                                                        color: STATUS_COLORS[c.status || 'Pending'],
                                                        border: `1px solid ${STATUS_COLORS[c.status || 'Pending']}30`
                                                    }}>
                                                        {c.status || "Pending"}
                                                    </span>
                                                </td>
                                                <td className="pe-4 text-end text-muted small">{new Date(c.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {recentComplaints.length > 0 && (
                            <div className="p-2 text-center border-top">
                                <button className="btn btn-sm btn-link text-primary fw-bold" onClick={() => navigate('/admin/manage-complaints')}>
                                    View All Complaints <i className="fas fa-arrow-right ms-1"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Top Cities by Complaints ────────────────────────────── */}
            <div className="row g-4 mt-2">
                <div className="col-lg-6">
                    <h5 className="fw-bold mb-3">Top Cities by Complaints</h5>
                    <div className="dashboard-card p-4 shadow-sm border-0 bg-white" style={{ borderRadius: '12px' }}>
                        {topMCs.length === 0 ? (
                            <p className="text-center text-muted small py-3">No data available</p>
                        ) : (
                            topMCs.map((mc, i) => {
                                const maxCount = topMCs[0]?.count || 1;
                                const pct = Math.round((mc.count / maxCount) * 100);
                                const barColors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
                                return (
                                    <div key={i} className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="small fw-bold">{mc.city}</span>
                                            <span className="badge bg-light text-dark border fw-bold small">{mc.count}</span>
                                        </div>
                                        <div className="progress" style={{ height: '6px', borderRadius: '3px' }}>
                                            <div className="progress-bar" role="progressbar"
                                                style={{ width: `${pct}%`, background: barColors[i % barColors.length], borderRadius: '3px', transition: 'width 0.5s ease' }}>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ── System Status ───────────────────────────────────── */}
                <div className="col-lg-6">
                    <h5 className="fw-bold mb-3">System Status</h5>
                    <div className="dashboard-card p-4 shadow-sm border-0 bg-white" style={{ borderRadius: '12px' }}>
                        {[
                            { label: "Backend Server", status: "Operational", icon: "fa-server", color: "#10b981" },
                            { label: "Complaint Routing", status: stats.mcs > 0 ? "Active" : "No MCs", icon: "fa-route", color: stats.mcs > 0 ? "#10b981" : "#f59e0b" },
                            { label: "Area Coverage", status: `${stats.totalAreas} zones`, icon: "fa-map", color: "#3b82f6" },
                            { label: "Report Queue", status: stats.pendingReports > 0 ? `${stats.pendingReports} pending` : "All reviewed", icon: "fa-clipboard-check", color: stats.pendingReports > 0 ? "#f59e0b" : "#10b981" }
                        ].map((item, i) => (
                            <div key={i} className="d-flex justify-content-between align-items-center py-2 border-bottom last-child-no-border">
                                <div className="d-flex align-items-center gap-3">
                                    <span className="d-flex align-items-center justify-content-center rounded"
                                        style={{ width: 32, height: 32, background: `${item.color}15`, color: item.color, fontSize: '0.8rem' }}>
                                        <i className={`fas ${item.icon}`}></i>
                                    </span>
                                    <span className="small fw-semibold">{item.label}</span>
                                </div>
                                <span className="d-flex align-items-center gap-1 small fw-bold" style={{ color: item.color }}>
                                    <span className="rounded-circle" style={{ width: 6, height: 6, background: item.color }}></span>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

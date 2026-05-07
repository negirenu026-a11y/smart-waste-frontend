import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../../utils/api";

const McDashboard = () => {
    const { user } = useOutletContext();
    const navigate = useNavigate();
    
    const [stats, setStats] = useState({
        workers: 0,
        workersOnLeave: 0,
        tasks: 0,
        tasksCompleted: 0,
        complaints: 0,
        complaintsResolved: 0,
        totalComplaints: 0
    });
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [workersByRole, setWorkersByRole] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const [workersRes, tasksRes, complaintsRes] = await Promise.all([
                    api.get("/workers"),
                    api.get("/tasks"),
                    api.get("/complaints")
                ]);
                const workers = workersRes.data.workers || [];
                const tasks = tasksRes.data.tasks || [];
                const complaints = complaintsRes.data.complaints || [];

                // Worker role breakdown
                const roleCount = {};
                workers.forEach(w => {
                    const role = w.role || "Unassigned";
                    roleCount[role] = (roleCount[role] || 0) + 1;
                });
                setWorkersByRole(Object.entries(roleCount).map(([role, count]) => ({ role, count })));


                const resolved = complaints.filter(c => c.status === 'Resolved').length;
                const completedTasks = tasks.filter(t => t.status === 'Completed' || t.status === 'Resolved').length;
                const onLeave = workers.filter(w => w.leaveStatus === "On Leave").length;

                setStats({
                    workers: workers.length,
                    workersOnLeave: onLeave,
                    tasks: tasks.filter(t => t.status !== 'Resolved' && t.status !== 'Completed').length,
                    tasksCompleted: completedTasks,
                    complaints: complaints.filter(c => c.status !== 'Resolved').length,
                    complaintsResolved: resolved,
                    totalComplaints: complaints.length
                });

                // Recent complaints (latest 5)
                setRecentComplaints(complaints.slice(0, 5));
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
                setStats({ workers: 0, workersOnLeave: 0, tasks: 0, tasksCompleted: 0, complaints: 0, complaintsResolved: 0, totalComplaints: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const quickActions = [
        { label: "Register Worker", icon: "fa-user-plus", color: "#10b981", path: "/mc/manage-workers" },
        { label: "Create Task", icon: "fa-tasks", color: "#3b82f6", path: "/mc/tasks" },
        { label: "View Complaints", icon: "fa-file-invoice", color: "#ef4444", path: "/mc/complaints" },
        { label: "Weekly Report", icon: "fa-chart-bar", color: "#f59e0b", path: "/mc/reports" }
    ];

    const STATUS_COLORS = {
        Pending: "#ef4444",
        "In Process": "#f59e0b",
        Resolved: "#10b981",
    };

    const roleColors = {
        Driver: "#3b82f6",
        Sweeper: "#8b5cf6",
        Collector: "#f97316",
        Supervisor: "#10b981",
        Unassigned: "#94a3b8"
    };

    // Resolution rate
    const resolutionRate = stats.totalComplaints > 0
        ? Math.round((stats.complaintsResolved / stats.totalComplaints) * 100)
        : 0;

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Operations Overview</h2>
                <p className="text-muted">Welcome back, {user?.name}. Here's the current state of your zone.</p>
            </header>

            {/* ── Metric Cards ────────────────────────────────────────── */}
            <div className="row g-3 mb-4">
                {[
                    { label: "Active Workers", value: stats.workers - stats.workersOnLeave, icon: "fa-hard-hat", color: "#10b981", sub: `${stats.workersOnLeave} on leave` },
                    { label: "Pending Complaints", value: stats.complaints, icon: "fa-exclamation-triangle", color: "#ef4444", sub: `${stats.complaintsResolved} resolved` },
                    { label: "Active Tasks", value: stats.tasks, icon: "fa-clipboard-list", color: "#3b82f6", sub: `${stats.tasksCompleted} completed` },
                    { label: "Resolution Rate", value: `${resolutionRate}%`, icon: "fa-chart-line", color: "#8b5cf6", sub: `${stats.totalComplaints} total` },
                    { label: "Total Workforce", value: stats.workers, icon: "fa-users", color: "#06b6d4", sub: `${workersByRole.length} roles` }
                ].map((m, i) => (
                    <div key={i} className="col-md-4 col-lg-2">
                        <div className="dashboard-card p-3 shadow-sm border-0 bg-white h-100 hover-lift" style={{ borderRadius: '12px' }}>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="d-flex align-items-center justify-content-center rounded-circle"
                                    style={{ width: 34, height: 34, background: `${m.color}15`, color: m.color, fontSize: '0.85rem' }}>
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
                                        <th className="small fw-bold">Location</th>
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
                                            <tr key={c._id} style={{ cursor: 'pointer' }} onClick={() => navigate('/mc/complaints')}>
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
                                                <td className="small text-muted">{c.city}, {c.zone}</td>
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
                                <button className="btn btn-sm btn-link text-primary fw-bold" onClick={() => navigate('/mc/complaints')}>
                                    View All Complaints <i className="fas fa-arrow-right ms-1"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Worker Availability & Role Breakdown ────────────── */}
                <div className="col-lg-4">
                    <h5 className="fw-bold mb-3">Worker Overview</h5>
                    <div className="dashboard-card p-4 shadow-sm border-0 bg-white" style={{ borderRadius: '12px' }}>
                        {/* Availability bar */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="small fw-bold text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Availability</span>
                                <span className="small fw-bold">{stats.workers - stats.workersOnLeave}/{stats.workers}</span>
                            </div>
                            <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                                <div className="progress-bar" role="progressbar"
                                    style={{ width: stats.workers > 0 ? `${((stats.workers - stats.workersOnLeave) / stats.workers) * 100}%` : '0%', background: '#10b981', borderRadius: '4px' }}>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.65rem' }}>
                                <span className="text-success fw-bold">{stats.workers - stats.workersOnLeave} Available</span>
                                <span className="text-danger fw-bold">{stats.workersOnLeave} On Leave</span>
                            </div>
                        </div>

                        {/* Role Breakdown */}
                        <div>
                            <span className="small fw-bold text-muted text-uppercase d-block mb-2" style={{ fontSize: '0.65rem' }}>By Role</span>
                            {workersByRole.length === 0 ? (
                                <p className="small text-muted text-center py-3">No workers registered</p>
                            ) : (
                                workersByRole.map((r, i) => (
                                    <div key={i} className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="rounded-circle" style={{ width: 8, height: 8, background: roleColors[r.role] || '#94a3b8', flexShrink: 0 }}></span>
                                            <span className="small fw-semibold">{r.role}</span>
                                        </div>
                                        <span className="badge bg-light text-dark border fw-bold small">{r.count}</span>
                                    </div>
                                ))
                            )}
                        </div>

                        <hr className="my-3" />

                        {/* Resolution Rate Ring */}
                        <div className="text-center">
                            <span className="small fw-bold text-muted text-uppercase d-block mb-2" style={{ fontSize: '0.65rem' }}>Complaint Resolution</span>
                            <div className="position-relative d-inline-block" style={{ width: 80, height: 80 }}>
                                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3"
                                        strokeDasharray={`${resolutionRate} ${100 - resolutionRate}`}
                                        strokeLinecap="round" />
                                </svg>
                                <div className="position-absolute top-50 start-50 translate-middle fw-bold" style={{ fontSize: '0.9rem' }}>
                                    {resolutionRate}%
                                </div>
                            </div>
                            <div className="small text-muted mt-1">{stats.complaintsResolved} of {stats.totalComplaints} resolved</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default McDashboard;
import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { useSearch } from "../../../context/SearchContext";

/* ─── Badge helpers ──────────────────────────────────────────────── */
const priorityStyle = {
    High: { bg: "#fef2f2", color: "#991b1b", border: "#fecaca", icon: "fa-fire", dot: "#ef4444" },
    Medium: { bg: "#fffbeb", color: "#92400e", border: "#fde68a", icon: "fa-circle-half-stroke", dot: "#f59e0b" },
    Low: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0", icon: "fa-leaf", dot: "#22c55e" },
};

const statusStyle = {
    Pending: { bg: "#f8fafc", color: "#475569", border: "#cbd5e1", icon: "fa-clock" },
    "In Progress": { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", icon: "fa-spinner" },
    Completed: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0", icon: "fa-circle-check" },
    Resolved: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0", icon: "fa-check-double" },
};

const PriorityBadge = ({ priority }) => {
    const s = priorityStyle[priority] || priorityStyle.Medium;
    return (
        <span className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill fw-bold"
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: "0.78rem" }}>
            <i className={`fas ${s.icon}`} style={{ fontSize: "0.7rem" }}></i>
            {priority}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const s = statusStyle[status] || statusStyle.Pending;
    return (
        <span className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill fw-bold"
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: "0.78rem" }}>
            <i className={`fas ${s.icon}`} style={{ fontSize: "0.7rem" }}></i>
            {status}
        </span>
    );
};

const DeadlineBadge = ({ deadline, status }) => {
    if (!deadline || status === "Completed" || status === "Resolved") return (
        <span className="text-muted small">{deadline ? new Date(deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
    );
    const now = new Date();
    const dl = new Date(deadline);
    const diffDays = Math.ceil((dl - now) / 86400000);
    let style = { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0", label: "On Time", icon: "fa-calendar-check" };
    if (diffDays < 0) style = { bg: "#fef2f2", color: "#991b1b", border: "#fecaca", label: `${Math.abs(diffDays)}d overdue`, icon: "fa-triangle-exclamation" };
    else if (diffDays <= 2) style = { bg: "#fffbeb", color: "#92400e", border: "#fde68a", label: `${diffDays}d left`, icon: "fa-hourglass-half" };
    else style = { ...style, label: `${diffDays}d left` };
    return (
        <div className="d-flex flex-column gap-1">
            <span className="small text-muted">{dl.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            <span className="d-inline-flex align-items-center gap-1 px-2 py-0 rounded-pill fw-bold"
                style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}`, fontSize: "0.72rem", width: "fit-content" }}>
                <i className={`fas ${style.icon}`} style={{ fontSize: "0.65rem" }}></i>
                {style.label}
            </span>
        </div>
    );
};
/* ─────────────────────────────────────────────────────────────────── */

const ManageTasks = () => {
    const { searchTerm } = useSearch();
    const [tasks, setTasks] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filterStatus, setFilterStatus] = useState("All");
    const [formData, setFormData] = useState({
        title: "",
        assignedTo: "",
        assignedToId: "",
        deadline: "",
        priority: "Medium",
        description: ""
    });

    useEffect(() => {
        fetchTasks();
        fetchWorkers();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get("/tasks");
            setTasks(res.data.tasks || []);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkers = async () => {
        try {
            const res = await api.get("/workers");
            setWorkers(res.data.workers || []);
        } catch (err) {
            console.error("Error fetching workers:", err);
        }
    };

    // Only show workers who are NOT on leave in the assignment dropdown
    const availableWorkers = workers.filter(w => w.leaveStatus !== "On Leave");

    const handleWorkerChange = (e) => {
        const workerId = e.target.value;
        const worker = workers.find(w => w._id === workerId);
        setFormData({ ...formData, assignedToId: workerId, assignedTo: worker ? worker.name : "" });
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/tasks", formData);
            if (res.data.success) {
                toast.success("Task created and assigned!");
                setFormData({ title: "", assignedTo: "", assignedToId: "", deadline: "", priority: "Medium", description: "" });
                setShowForm(false);
                fetchTasks();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create task.");
        }
    };

    const updateTaskStatus = async (id, status) => {
        try {
            const res = await api.patch(`/tasks/${id}`, { status });
            if (res.data.success) { toast.success(`Task marked as ${status}`); fetchTasks(); }
        } catch (err) {
            toast.error("Failed to update task status.");
        }
    };

    const deleteTask = async (id) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            const res = await api.delete(`/tasks/${id}`);
            if (res.data.success) { toast.success("Task removed."); fetchTasks(); }
        } catch (err) {
            toast.error("Failed to delete task.");
        }
    };

    const filteredByStatus = filterStatus === "All" ? tasks : tasks.filter(t => t.status === filterStatus);

    const displayTasks = filteredByStatus.filter(t => 
        Object.values(t).some(val => 
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const counts = {
        Pending: tasks.filter(t => t.status === "Pending").length,
        "In Progress": tasks.filter(t => t.status === "In Progress").length,
        Completed: tasks.filter(t => t.status === "Completed" || t.status === "Resolved").length,
    };

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold">Task Management</h2>
                    <p className="text-muted mb-0">Create, assign, and monitor cleanup operations.</p>
                </div>
                <button className="btn fw-bold px-4"
                    style={{ background: '#10b981', border: 'none', color: '#fff', borderRadius: '10px' }}
                    onClick={() => setShowForm(!showForm)}>
                    <i className={`fas ${showForm ? "fa-times" : "fa-plus"} me-2`}></i>
                    {showForm ? "Cancel" : "New Task"}
                </button>
            </header>

            {/* Summary pills */}
            <div className="d-flex gap-3 mb-4 flex-wrap">
                {[
                    { label: "Pending", count: counts.Pending, bg: "#f8fafc", color: "#475569", border: "#cbd5e1", icon: "fa-clock" },
                    { label: "In Progress", count: counts["In Progress"], bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", icon: "fa-spinner" },
                    { label: "Completed", count: counts.Completed, bg: "#f0fdf4", color: "#166534", border: "#bbf7d0", icon: "fa-circle-check" },
                ].map(({ label, count, bg, color, border, icon }) => (
                    <button key={label}
                        onClick={() => setFilterStatus(filterStatus === label ? "All" : label)}
                        className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-bold border-0"
                        style={{ background: bg, color, border: `1px solid ${border}`, outline: filterStatus === label ? `2px solid ${color}` : "none", cursor: "pointer" }}>
                        <i className={`fas ${icon}`} style={{ fontSize: "0.8rem" }}></i>
                        <span className="small">{count} {label}</span>
                    </button>
                ))}
            </div>

            {showForm && (
                <div className="dashboard-card mb-4 p-4 border-0 shadow-sm bg-white" style={{ borderRadius: '14px' }}>
                    <h5 className="fw-bold mb-3">Create New Task</h5>
                    <form onSubmit={handleAddTask} className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Task Title</label>
                            <input type="text" name="title" className="form-control" placeholder="e.g. Clear overflow at Sector 4"
                                value={formData.title} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">
                                Assign Worker
                                {workers.length !== availableWorkers.length && (
                                    <span className="ms-2 text-muted fw-normal" style={{ fontSize: "0.75rem" }}>
                                        ({workers.length - availableWorkers.length} on leave, hidden)
                                    </span>
                                )}
                            </label>
                            <select name="assignedToId" className="form-select" value={formData.assignedToId} onChange={handleWorkerChange} required>
                                <option value="">Select Available Worker</option>
                                {availableWorkers.map(w => (
                                    <option key={w._id} value={w._id}>{w.name} — {w.role}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Deadline</label>
                            <input type="date" name="deadline" className="form-control" value={formData.deadline} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Priority</label>
                            <select name="priority" className="form-select" value={formData.priority} onChange={handleInputChange}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                            <button type="submit" className="btn fw-bold w-100 py-2"
                                style={{ background: '#10b981', color: '#fff', borderRadius: '10px', border: 'none' }}>
                                Create &amp; Assign
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white" style={{ borderRadius: '14px' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th className="ps-4 py-3 text-uppercase small fw-bold text-muted">Task</th>
                                <th className="py-3 text-uppercase small fw-bold text-muted">Assigned To</th>
                                <th className="py-3 text-uppercase small fw-bold text-muted">Deadline</th>
                                <th className="py-3 text-uppercase small fw-bold text-muted">Priority</th>
                                <th className="py-3 text-uppercase small fw-bold text-muted">Status</th>
                                <th className="py-3 text-uppercase small fw-bold text-muted text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-5">
                                    <div className="spinner-border text-success" role="status"><span className="visually-hidden">Loading...</span></div>
                                </td></tr>
                            ) : displayTasks.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-5 text-muted">
                                    <i className="fas fa-search fa-2x mb-2 d-block opacity-25"></i>
                                    No matching results found.
                                </td></tr>
                            ) : (
                                displayTasks.map((task) => {
                                    const isDone = task.status === "Completed" || task.status === "Resolved";
                                    return (
                                        <tr key={task._id}>
                                            <td className="ps-4">
                                                <div className="fw-bold text-dark" style={{ maxWidth: 220 }}>{task.title}</div>
                                                {task.description && (
                                                    <div className="text-muted small text-truncate" style={{ maxWidth: 220 }}>{task.description}</div>
                                                )}
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                                                        style={{ width: 32, height: 32, background: '#10b981', fontSize: '0.8rem', flexShrink: 0 }}>
                                                        {task.assignedTo?.[0]?.toUpperCase() || "?"}
                                                    </div>
                                                    <span className="small fw-semibold">{task.assignedTo || "Unassigned"}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <DeadlineBadge deadline={task.deadline} status={task.status} />
                                            </td>
                                            <td>
                                                <PriorityBadge priority={task.priority} />
                                            </td>
                                            <td>
                                                <StatusBadge status={task.status} />
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="d-flex gap-2 justify-content-end align-items-center">
                                                    {!isDone ? (
                                                        <>
                                                            <select
                                                                className="form-select form-select-sm w-auto"
                                                                style={{ borderRadius: '8px', fontSize: '0.8rem' }}
                                                                value={task.status}
                                                                onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="In Progress">In Progress</option>
                                                                <option value="Completed">Completed</option>
                                                            </select>
                                                            <button className="btn btn-sm" onClick={() => deleteTask(task._id)}
                                                                style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px' }}>
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="d-flex align-items-center gap-2">
                                                            {task.completionProof && (
                                                                <img src={`http://localhost:4000${task.completionProof}`}
                                                                    alt="Proof" className="rounded border"
                                                                    style={{ width: 36, height: 36, objectFit: 'cover' }} />
                                                            )}
                                                            <span className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill fw-bold"
                                                                style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontSize: '0.75rem' }}>
                                                                <i className="fas fa-check-double" style={{ fontSize: '0.65rem' }}></i>
                                                                Verified
                                                            </span>
                                                            <button className="btn btn-sm ms-1" onClick={() => deleteTask(task._id)}
                                                                style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px' }}>
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageTasks;
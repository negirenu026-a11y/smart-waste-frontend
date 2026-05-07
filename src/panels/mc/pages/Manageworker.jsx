import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { useSearch } from "../../../context/SearchContext";

const leaveStatusStyle = {
    "Available": {
        bg: "rgba(16,185,129,0.12)",
        color: "#065f46",
        border: "1px solid #6ee7b7",
        icon: "fa-circle-check"
    },
    "On Leave": {
        bg: "rgba(239,68,68,0.1)",
        color: "#991b1b",
        border: "1px solid #fca5a5",
        icon: "fa-calendar-xmark"
    }
};

const roleColors = {
    Driver: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    Sweeper: { bg: "#faf5ff", color: "#6d28d9", border: "#ddd6fe" },
    Collector: { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
    Supervisor: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
};

const ManageWorkers = () => {
    const { searchTerm } = useSearch();
    const { user } = useOutletContext();
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingWorker, setEditingWorker] = useState(null);
    const [leaveLoading, setLeaveLoading] = useState(null);
    const [leavePicker, setLeavePicker] = useState(null);   // worker._id currently picking a date
    const [leaveDate, setLeaveDate] = useState("");          // selected leave-until date
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        area: "",
        role: ""
    });

    useEffect(() => {
        fetchWorkers();
    }, []);

    const fetchWorkers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/workers");
            setWorkers(res.data.workers || []);
        } catch (err) {
            console.error("Error fetching workers:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const contactRegex = /^[0-9]{10}$/;
        if (!contactRegex.test(formData.contact)) {
            toast.warning("Contact number must be exactly 10 digits.");
            return;
        }
        try {
            if (editingWorker) {
                const res = await api.patch(`/workers/${editingWorker._id}`, formData);
                if (res.data.success) { toast.success("Worker updated!"); fetchWorkers(); }
            } else {
                const res = await api.post("/workers", { ...formData, mcId: user?._id });
                if (res.data.success) { toast.success("Worker registered!"); fetchWorkers(); }
            }
            setFormData({ name: "", contact: "", area: "", role: "" });
            setEditingWorker(null);
            setShowForm(false);
        } catch (err) {
            toast.error("Failed to save worker details.");
        }
    };

    const deleteWorker = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const res = await api.delete(`/workers/${id}`);
            if (res.data.success) { toast.success("Worker removed."); fetchWorkers(); }
        } catch (err) {
            toast.error("Failed to delete worker.");
        }
    };

    const toggleLeave = async (worker) => {
        // If already on leave → mark Available immediately
        if (worker.leaveStatus === "On Leave") {
            setLeaveLoading(worker._id);
            try {
                const res = await api.patch(`/workers/${worker._id}`, { leaveStatus: "Available", leaveUntil: null });
                if (res.data.success) { toast.success(`${worker.name} is now Available.`); fetchWorkers(); }
            } catch { toast.error("Failed to update leave status."); }
            finally { setLeaveLoading(null); }
        } else {
            // Show inline date picker
            setLeavePicker(worker._id);
            // Default to today
            // const today = new Date();
            setLeaveDate(today.toISOString().split("T")[0]);
        }
    };

    const confirmLeave = async (worker) => {
        if (!leaveDate) { toast.warning("Please select the leave date."); return; }
        setLeaveLoading(worker._id);
        setLeavePicker(null);
        try {
            const res = await api.patch(`/workers/${worker._id}`, {
                leaveStatus: "On Leave",
                leaveUntil: new Date(leaveDate)
            });
            if (res.data.success) {
                toast.success(`${worker.name} on leave until ${new Date(leaveDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}.`);
                fetchWorkers();
            }
        } catch { toast.error("Failed to set leave."); }
        finally { setLeaveLoading(null); setLeaveDate(""); }
    };

    const startEdit = (worker) => {
        setEditingWorker(worker);
        setFormData({ name: worker.name, contact: worker.contact, area: worker.area, role: worker.role });
        setShowForm(true);
    };

    const onLeaveCount = workers.filter(w => w.leaveStatus === "On Leave").length;
    const availableCount = workers.filter(w => w.leaveStatus !== "On Leave").length;

    const filteredWorkers = (workers || []).filter(w => 
        Object.values(w).some(val => 
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold">Worker Directory</h2>
                    <p className="text-muted mb-0">Manage your field staff, assignments, and leave.</p>
                </div>
                <button
                    className="btn px-4 fw-bold"
                    style={{ background: '#10b981', border: 'none', color: '#fff', borderRadius: '10px' }}
                    onClick={() => { setShowForm(!showForm); setEditingWorker(null); setFormData({ name: "", contact: "", area: "", role: "" }); }}
                >
                    <i className={`fas ${showForm ? "fa-times" : "fa-plus"} me-2`}></i>
                    {showForm ? "Cancel" : "Register Worker"}
                </button>
            </header>

            {/* Summary pills */}
            <div className="d-flex gap-3 mb-4 flex-wrap">
                <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #6ee7b7' }}>
                    <i className="fas fa-users" style={{ color: '#10b981' }}></i>
                    <span className="fw-bold small" style={{ color: '#065f46' }}>{workers.length} Total Workers</span>
                </div>
                <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid #a7f3d0' }}>
                    <i className="fas fa-circle-check" style={{ color: '#059669' }}></i>
                    <span className="fw-bold small" style={{ color: '#065f46' }}>{availableCount} Available</span>
                </div>
                <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid #fca5a5' }}>
                    <i className="fas fa-calendar-xmark" style={{ color: '#ef4444' }}></i>
                    <span className="fw-bold small" style={{ color: '#991b1b' }}>{onLeaveCount} On Leave</span>
                </div>
            </div>

            {showForm && (
                <div className="dashboard-card mb-4 p-4 border-0 shadow-sm bg-white" style={{ borderRadius: '14px' }}>
                    <h5 className="fw-bold mb-3">{editingWorker ? "Edit Worker Details" : "Register New Worker"}</h5>
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Full Name</label>
                            <input type="text" name="name" className="form-control" placeholder="Worker name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Contact No</label>
                            <input type="text" name="contact" className="form-control" placeholder="10-digit number" value={formData.contact} onChange={handleInputChange} maxLength="10" pattern="[0-9]{10}" required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Assigned Area</label>
                            <input type="text" name="area" className="form-control" placeholder="Type area name..." value={formData.area} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Role</label>
                            <select name="role" className="form-select" value={formData.role} onChange={handleInputChange} required>
                                <option value="">Select Role</option>
                                <option value="Driver">Driver</option>
                                <option value="Sweeper">Sweeper</option>
                                <option value="Collector">Collector</option>
                                <option value="Supervisor">Supervisor</option>
                            </select>
                        </div>
                        <div className="col-12 text-end">
                            <button type="submit" className="btn fw-bold px-5" style={{ background: '#10b981', color: '#fff', borderRadius: '10px' }}>
                                {editingWorker ? "Update Worker" : "Register Worker"}
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
                                <th className="ps-4 py-3 text-uppercase small fw-bold text-muted">Worker</th>
                                <th className="py-3 text-uppercase small fw-bold text-muted">Contact</th>
                                <th className="py-3 text-uppercase small fw-bold text-muted">Area</th>
                                <th className="py-3 text-uppercase small fw-bold text-muted">Role</th>
                                <th className="py-3 text-uppercase small fw-bold text-muted">Leave Status</th>
                                <th className="py-3 text-uppercase small fw-bold text-muted text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-5">
                                    <div className="spinner-border text-success" role="status"><span className="visually-hidden">Loading...</span></div>
                                </td></tr>
                            ) : filteredWorkers.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-5 text-muted">
                                    <i className="fas fa-search fa-2x mb-2 d-block opacity-25"></i>
                                    No matching results found.
                                </td></tr>
                            ) : (
                                filteredWorkers.map((w) => {
                                    const leave = leaveStatusStyle[w.leaveStatus] || leaveStatusStyle["Available"];
                                    const role = roleColors[w.role] || { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" };
                                    const isOnLeave = w.leaveStatus === "On Leave";
                                    return (
                                        <tr key={w._id} style={{ opacity: isOnLeave ? 0.75 : 1, transition: 'opacity 0.2s' }}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                                                        style={{ width: 38, height: 38, background: isOnLeave ? '#ef4444' : '#10b981', fontSize: '0.9rem', flexShrink: 0 }}>
                                                        {w.name?.[0]?.toUpperCase() || "W"}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold">{w.name}</div>
                                                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{w.area}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-muted small">
                                                <i className="fas fa-phone me-1 text-muted opacity-50"></i>{w.contact || "—"}
                                            </td>
                                            <td className="small">{w.area || "—"}</td>
                                            <td>
                                                <span className="px-3 py-1 rounded-pill fw-bold small"
                                                    style={{ background: role.bg, color: role.color, border: `1px solid ${role.border}` }}>
                                                    {w.role || "—"}
                                                </span>
                                            </td>
                                            <td>
                                                <div>
                                                    <span className="px-3 py-1 rounded-pill fw-bold small d-inline-flex align-items-center gap-1"
                                                        style={{ background: leave.bg, color: leave.color, border: leave.border }}>
                                                        <i className={`fas ${leave.icon}`} style={{ fontSize: '0.7rem' }}></i>
                                                        {w.leaveStatus || "Available"}
                                                    </span>
                                                    {isOnLeave && w.leaveUntil && (
                                                        <div className="text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                                                            Until {new Date(w.leaveUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="d-flex gap-2 justify-content-end align-items-center flex-wrap">
                                                    {/* Inline date picker for leave */}
                                                    {leavePicker === w._id && (
                                                        <div className="d-flex align-items-center gap-2 p-2 rounded-3 shadow-sm"
                                                            style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                                                            <input
                                                                type="date"
                                                                className="form-control form-control-sm"
                                                                style={{ width: 140, borderRadius: '8px', fontSize: '0.8rem' }}
                                                                value={leaveDate}
                                                                min={new Date().toISOString().split("T")[0]}
                                                                onChange={e => setLeaveDate(e.target.value)}
                                                            />
                                                            <button className="btn btn-sm fw-bold"
                                                                style={{ background: '#ef4444', color: '#fff', borderRadius: '8px', fontSize: '0.75rem' }}
                                                                onClick={() => confirmLeave(w)}>
                                                                Confirm
                                                            </button>
                                                            <button className="btn btn-sm"
                                                                style={{ background: '#f1f5f9', color: '#475569', borderRadius: '8px', fontSize: '0.75rem' }}
                                                                onClick={() => setLeavePicker(null)}>
                                                                ✕
                                                            </button>
                                                        </div>
                                                    )}
                                                    {/* Leave toggle button */}
                                                    <button
                                                        className="btn btn-sm fw-bold"
                                                        title={isOnLeave ? "Mark Available" : "Mark On Leave"}
                                                        disabled={leaveLoading === w._id}
                                                        onClick={() => toggleLeave(w)}
                                                        style={{
                                                            background: isOnLeave ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                            border: isOnLeave ? '1px solid #6ee7b7' : '1px solid #fca5a5',
                                                            color: isOnLeave ? '#065f46' : '#991b1b',
                                                            borderRadius: '8px',
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        {leaveLoading === w._id
                                                            ? <span className="spinner-border spinner-border-sm"></span>
                                                            : <><i className={`fas ${isOnLeave ? 'fa-circle-check' : 'fa-calendar-xmark'} me-1`}></i>
                                                                {isOnLeave ? "Set Available" : "Set On Leave"}</>
                                                        }
                                                    </button>
                                                    <button className="btn btn-sm" onClick={() => startEdit(w)}
                                                        style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '8px' }}>
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button className="btn btn-sm" onClick={() => deleteWorker(w._id)}
                                                        style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px' }}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
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

export default ManageWorkers;
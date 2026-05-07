import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { toast } from 'react-toastify';
import { useSearch } from "../../../context/SearchContext";

const WeeklyReport = () => {
    const { searchTerm } = useSearch();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        workers: 0,
        tasks: 0,
        pendingTasks: 0,
        resolvedTasks: 0
    });
    
    // Form states
    const [showForm, setShowForm] = useState(false);
    const [editingReport, setEditingReport] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        tasksCompleted: 0,
        pendingTasks: 0,
        workersInvolved: 0
    });

    useEffect(() => {
        fetchReports();
        fetchCurrentStats();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await api.get("/reports");
            setReports(res.data.reports || []);
        } catch (err) {
            console.error("Error fetching reports:", err);
            toast.error("Failed to load reports.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentStats = async () => {
        try {
            const [workersRes, tasksRes] = await Promise.all([
                api.get("/workers"),
                api.get("/tasks")
            ]);

            const workers = workersRes.data.workers || [];
            const tasks = tasksRes.data.tasks || [];

            const completed = tasks.filter(t => t.status === 'Resolved' || t.status === 'Completed').length;
            const pending = tasks.length - completed;

            setStats({
                workers: workers.length,
                tasks: tasks.length,
                pendingTasks: pending,
                resolvedTasks: completed
            });
            
            // No auto-fill as per requirements
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    const handleToggleForm = (report = null) => {
        if (report) {
            setEditingReport(report);
            setFormData({
                title: report.title,
                description: report.description,
                tasksCompleted: report.tasksCompleted,
                pendingTasks: report.pendingTasks,
                workersInvolved: report.workersInvolved
            });
            setShowForm(true);
        } else {
            if (showForm && !editingReport) {
                setShowForm(false);
            } else {
                setEditingReport(null);
                setFormData({
                    title: `Weekly Report - ${new Date().toLocaleDateString()}`,
                    description: "",
                    tasksCompleted: 0,
                    pendingTasks: 0,
                    workersInvolved: 0
                });
                setShowForm(true);
            }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingReport) {
                const res = await api.patch(`/reports/${editingReport._id}`, formData);
                if (res.data.success) {
                    toast.success("Report updated successfully!");
                }
            } else {
                const res = await api.post("/reports", formData);
                if (res.data.success) {
                    toast.success("Report created and submitted!");
                }
            }
            setShowForm(false);
            setEditingReport(null);
            fetchReports();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this report?")) return;
        try {
            await api.delete(`/reports/${id}`);
            toast.success("Report deleted.");
            fetchReports();
        } catch (err) {
            toast.error("Failed to delete report.");
        }
    };

    const filteredReports = (reports || []).filter(report => 
        Object.values(report).some(val => 
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold text-success">Weekly Reports</h2>
                    <p className="text-muted mb-0">Manage and track your municipal performance submissions.</p>
                </div>
                <button 
                    className={`btn ${showForm ? 'btn-light' : 'btn-success'} fw-bold px-4 shadow-sm`}
                    onClick={() => handleToggleForm()}
                >
                    <i className={`fas ${showForm ? 'fa-times' : 'fa-plus-circle'} me-2`} /> 
                    {showForm ? "Cancel" : "Create New Report"}
                </button>
            </header>

            {/* Form Section */}
            {showForm && (
                <div className="dashboard-card mb-4 p-4 border-0 shadow-sm bg-white animate__animated animate__fadeInDown">
                    <h5 className="fw-bold mb-4">{editingReport ? "Update Weekly Report" : "Register New Weekly Report"}</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-12">
                                <label className="form-label small fw-bold">Report Title</label>
                                <input 
                                    className="form-control"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Weekly Report - Week 4 April"
                                    required
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label small fw-bold">Summary / Description</label>
                                <textarea 
                                    className="form-control"
                                    rows={3}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Briefly describe the work progress..."
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Tasks Completed</label>
                                <input 
                                    className="form-control"
                                    type="number"
                                    name="tasksCompleted"
                                    value={formData.tasksCompleted}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Pending Tasks</label>
                                <input 
                                    className="form-control"
                                    type="number"
                                    name="pendingTasks"
                                    value={formData.pendingTasks}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Workers Involved</label>
                                <input 
                                    className="form-control"
                                    type="number"
                                    name="workersInvolved"
                                    value={formData.workersInvolved}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-12 text-end mt-4">
                                <button type="submit" className="btn btn-success px-5 fw-bold shadow-sm">
                                    {editingReport ? "Save Changes" : "Submit Report"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Stats Overview for Quick Reference */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="dashboard-card text-center p-3 border shadow-none bg-white">
                        <div className="h3 fw-bold text-success mb-0">{stats.workers}</div>
                        <small className="text-muted text-uppercase fw-bold">Field Staff</small>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dashboard-card text-center p-3 border shadow-none bg-white">
                        <div className="h3 fw-bold text-primary mb-0">{stats.tasks}</div>
                        <small className="text-muted text-uppercase fw-bold">Total Workloads</small>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dashboard-card text-center p-3 border shadow-none bg-white">
                        <div className="h3 fw-bold text-info mb-0">{stats.resolvedTasks}</div>
                        <small className="text-muted text-uppercase fw-bold">Resolved</small>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dashboard-card text-center p-3 border shadow-none bg-white">
                        <div className="h3 fw-bold text-warning mb-0">{stats.pendingTasks}</div>
                        <small className="text-muted text-uppercase fw-bold">Pending</small>
                    </div>
                </div>
            </div>

            <div className="dashboard-card border-0 shadow-sm bg-white overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Report Title</th>
                                <th>City / District</th>
                                <th>Stats (Comp/Pend)</th>
                                <th>Status</th>
                                <th>Submission Date</th>
                                <th className="pe-4 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-5"><span className="spinner-border spinner-border-sm me-2"/>Loading operational logs...</td></tr>
                            ) : filteredReports.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-5 text-muted">No matching results found.</td></tr>
                            ) : (
                                filteredReports.map((r) => (
                                    <tr key={r._id}>
                                        <td className="ps-4">
                                            <div className="fw-bold text-primary">{r.title}</div>
                                            <div className="small text-muted text-truncate" style={{maxWidth: '200px'}}>{r.description || "No summary provided"}</div>
                                        </td>
                                        <td>
                                            <span className="fw-bold">{r.city}</span>
                                            <div className="small text-muted">{r.district}</div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">{r.tasksCompleted} C</span>
                                                <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25">{r.pendingTasks} P</span>
                                            </div>
                                            <small className="text-muted">{r.workersInvolved} Workers active</small>
                                        </td>
                                        <td>
                                            <span className={`badge ${
                                                r.status === 'Validated' ? 'bg-success' : 
                                                r.status === 'Rejected' ? 'bg-danger' : 
                                                'bg-info'
                                            } bg-opacity-10 text-${
                                                r.status === 'Validated' ? 'success' : 
                                                r.status === 'Rejected' ? 'danger' : 
                                                'info'
                                            } border`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                                        <td className="pe-4 text-end">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => handleToggleForm(r)}>
                                                    <i className="fas fa-edit"/>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r._id)}>
                                                    <i className="fas fa-trash"/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WeeklyReport;

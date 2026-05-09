import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { useSearch } from "../../../context/SearchContext";

const STATUS_COLORS = {
    Pending: "#ef4444",
    "In Process": "#f59e0b",
    Resolved: "#10b981",
};

const Managecomplaints = () => {
    const { searchTerm } = useSearch();
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const res = await api.get("/complaints");
            setComplaints(res.data.complaints || []);
        } catch (err) {
            toast.error("Failed to fetch complaints.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.patch(`/complaints/${id}/status`, { status: newStatus });
            toast.success(`Status updated to ${newStatus}`);
            fetchComplaints();
            if (selectedComplaint?._id === id) {
                setSelectedComplaint(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            toast.error("Failed to update status.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this complaint record?")) return;
        try {
            await api.delete(`/complaints/${id}`);
            toast.success("Complaint archived.");
            fetchComplaints();
            if (selectedComplaint?._id === id) setSelectedComplaint(null);
        } catch (err) {
            toast.error("Failed to delete complaint.");
        }
    };

    const filteredByStatus = filter === "All" ? complaints : complaints.filter((c) => c.status === filter);

    const filtered = filteredByStatus.filter(c =>
        Object.values(c).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const statusCounts = complaints.reduce((acc, c) => {
        const s = c.status || "Pending";
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, { All: complaints.length });

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                    <h2 className="fw-bold">Global Complaint Management</h2>
                    <p className="text-muted mb-0">Monitor and track waste management issues across all cities and zones.</p>
                </div>
            </header>

            <div className="row g-4 mb-4">
                {['All', 'Pending', 'In Process', 'Resolved'].map((s) => (
                    <div key={s} className="col-6 col-md-3">
                        <div
                            className={`dashboard-card p-3 shadow-sm border-0 bg-white text-center hover-lift ${filter === s ? 'border-bottom border-primary border-4' : ''}`}
                            onClick={() => setFilter(s)}
                            style={{ cursor: 'pointer' }}>
                            <h6 className="text-muted text-uppercase small fw-bold mb-1">{s}</h6>
                            <h3 className="fw-bold mb-0">{statusCounts[s] || 0}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Issue & Citizen</th>
                                <th>Regional Info</th>
                                <th>Ward & Location</th>
                                <th>Status</th>
                                <th className="pe-4 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-5">Loading complaints...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={5} className="text-center text-muted py-5">
                                    <i className="fas fa-search fa-2x mb-2 d-block opacity-25"></i>
                                    No matching results found.
                                </td></tr>
                            ) : (
                                filtered.map((c) => (
                                    <tr key={c._id}>
                                        <td className="ps-4" style={{ cursor: 'pointer' }} onClick={() => setSelectedComplaint(c)}>
                                            <div className="d-flex align-items-center gap-3">
                                                {c.imageUrl && (
                                                    <img src={`http://localhost:4000${c.imageUrl}`} alt="Issue" className="rounded" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                                )}
                                                <div>
                                                    <div className="fw-bold text-primary">{c.category || c.type}</div>
                                                    <div className="small text-muted">By: {c.citizenName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="mb-0"><strong>City:</strong> {c.city}</p>
                                            <p className="mb-0"><strong>Zone:</strong> {c.zone}</p>
                                        </td>
                                        <td>
                                            <p className="mb-0"><strong>Ward:</strong> {c.ward}</p>
                                            <p className="mb-0 text-muted small">{c.location}</p>
                                        </td>
                                        <td>
                                            <span className="badge" style={{ backgroundColor: `${STATUS_COLORS[c.status || 'Pending']}15`, color: STATUS_COLORS[c.status || 'Pending'], border: `1px solid ${STATUS_COLORS[c.status || 'Pending']}30` }}>
                                                {c.status || "Pending"}
                                            </span>
                                        </td>
                                        <td className="pe-4 text-end">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button className="btn btn-sm btn-outline-info" onClick={() => setSelectedComplaint(c)} title="View Details">
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <select
                                                    className="form-select form-select-sm w-auto"
                                                    value={c.status || "Pending"}
                                                    onChange={(e) => handleStatusChange(c._id, e.target.value)}
                                                >
                                                    {Object.keys(STATUS_COLORS).map(s => <option key={s}>{s}</option>)}
                                                </select>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}>
                                                    <i className="fas fa-trash"></i>
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

            {/* Complaint Detail Modal */}
            {selectedComplaint && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title fw-bold">Complaint Details</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedComplaint(null)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        {selectedComplaint.imageUrl ? (
                                            <img src={`http://localhost:4000${selectedComplaint.imageUrl}`} alt="Issue" className="img-fluid rounded shadow-sm" style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                                                <i className="fas fa-image fa-3x text-muted"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <h4 className="fw-bold mb-1">{selectedComplaint.category || selectedComplaint.type}</h4>
                                        <div className="mb-3">
                                            <span className="badge" style={{ backgroundColor: `${STATUS_COLORS[selectedComplaint.status || 'Pending']}15`, color: STATUS_COLORS[selectedComplaint.status || 'Pending'], border: `1px solid ${STATUS_COLORS[selectedComplaint.status || 'Pending']}30` }}>
                                                {selectedComplaint.status || "Pending"}
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <label className="text-muted small fw-bold d-block">Description</label>
                                            <p className="mb-0">{selectedComplaint.description || "No description provided."}</p>
                                        </div>

                                        <div className="row g-2 mb-3">
                                            <div className="col-6">
                                                <label className="text-muted small fw-bold d-block">Citizen</label>
                                                <span>{selectedComplaint.citizenName}</span>
                                            </div>
                                            <div className="col-6">
                                                <label className="text-muted small fw-bold d-block">Reported On</label>
                                                <span>{new Date(selectedComplaint.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="mb-3 p-3 bg-light rounded">
                                            <label className="text-muted small fw-bold d-block mb-1">Location Details</label>
                                            <p className="mb-1 small"><strong>City:</strong> {selectedComplaint.city}</p>
                                            <p className="mb-1 small"><strong>Zone:</strong> {selectedComplaint.zone}</p>
                                            <p className="mb-1 small"><strong>Ward:</strong> {selectedComplaint.ward}</p>
                                            <p className="mb-0 small"><strong>Location:</strong> {selectedComplaint.location}</p>
                                        </div>

                                        {selectedComplaint.status === "Resolved" && (
                                            <div className="mt-3 p-3 border border-success rounded bg-success bg-opacity-10">
                                                <h6 className="fw-bold text-success mb-2">Resolution Proof</h6>
                                                <p className="small mb-2"><strong>Note:</strong> {selectedComplaint.completionNote || "Resolved by MC."}</p>
                                                {selectedComplaint.proofImage && (
                                                    <img src={`http://localhost:4000${selectedComplaint.proofImage}`} alt="Proof" className="img-fluid rounded border shadow-sm" style={{ maxHeight: '150px' }} />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer bg-light border-0">
                                <div className="d-flex w-100 justify-content-between align-items-center">
                                    <div className="d-flex gap-2 align-items-center">
                                        <label className="small fw-bold">Update Status:</label>
                                        <select
                                            className="form-select form-select-sm w-auto"
                                            value={selectedComplaint.status || "Pending"}
                                            onChange={(e) => handleStatusChange(selectedComplaint._id, e.target.value)}
                                        >
                                            {Object.keys(STATUS_COLORS).map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <button type="button" className="btn btn-secondary px-4" onClick={() => setSelectedComplaint(null)}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Managecomplaints;
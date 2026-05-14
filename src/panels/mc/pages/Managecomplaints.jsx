import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { resolveMediaUrl } from "../../../utils/mediaUrl";
import { toast } from "react-toastify";
import { useSearch } from "../../../context/SearchContext";

const STATUS_COLORS = {
    Pending: "#ef4444",
    "In Process": "#f59e0b",
    Resolved: "#10b981",
};


const ManageComplaints = () => {
    const { searchTerm } = useSearch();
    const [complaints, setComplaints] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isAssigning, setIsAssigning] = useState(false);
    const [assignData, setAssignData] = useState({ workerId: "", deadline: "" });
    const [proofFile, setProofFile] = useState(null);
    const [note, setNote] = useState("");

    useEffect(() => {
        fetchComplaints();
        fetchWorkers();
    }, []);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const res = await api.get("/complaints");
            setComplaints(res.data.complaints || []);
        } catch (err) {
            console.error("Error fetching complaints:", err);
            toast.error("Failed to fetch complaints.");
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

    const handleAssign = async () => {
        if (!assignData.workerId || !assignData.deadline) {
            toast.warning("Please select a worker and set a deadline.");
            return;
        }
        const worker = displayWorkers.find(w => w._id === assignData.workerId);
        try {
            const res = await api.patch(`/complaints/${selectedComplaint._id}/status`, {
                status: "In Process",
                assignedWorker: worker.name,
                assignedWorkerId: worker._id,
                deadline: assignData.deadline
            });
            if (res.data.success) {
                toast.success("Worker assigned successfully.");
                fetchComplaints();
                setSelectedComplaint(null);
                setIsAssigning(false);
            }
        } catch (err) {
            console.error(err.response?.data);
            toast.error(err.response?.data?.message || "Failed to assign worker.");
        }
    };

    const handleResolve = async () => {
        try {
            const res = await api.patch(`/complaints/${selectedComplaint._id}/status`, {
                status: "Resolved"
            });
            if (res.data.success) {
                toast.success("Complaint resolved successfully!");
                fetchComplaints();
                setSelectedComplaint(null);
                setProofFile(null);
                setNote("");
            }
        } catch (err) {
            console.error(err.response?.data);
            toast.error(err.response?.data?.message || "Failed to resolve complaint.");
        }
    };

    const displayData = complaints;
    const displayWorkers = workers;
    const filteredByStatus = filter === "All" ? displayData : (displayData || []).filter(c => c.status === filter);

    const filtered = filteredByStatus.filter(c =>
        Object.values(c).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold">Citizen Complaints</h2>
                    <p className="text-muted">Manage and track reports submitted by the public in your region.</p>
                </div>
                <div className="btn-group shadow-sm">
                    {['All', 'Pending', 'In Process', 'Resolved'].map(s => (
                        <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-white bg-white'}`} onClick={() => setFilter(s)}>
                            {s}
                        </button>
                    ))}
                </div>
            </header>

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Citizen & Image</th>
                                <th>Details</th>
                                <th>Regional Info</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Feedback</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-5">Loading complaints...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-5 text-muted">
                                    <i className="fas fa-search fa-2x mb-2 d-block opacity-25"></i>
                                    No matching results found.
                                </td></tr>
                            ) : (
                                filtered.map((c) => (
                                    <tr key={c._id}>
                                        <td className="ps-4" style={{ cursor: 'pointer' }} onClick={() => setSelectedComplaint(c)}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="position-relative">
                                                    {c.imageUrl ? (
                                                        <img src={resolveMediaUrl(c.imageUrl)} alt="Report" className="rounded" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                                            <i className="fas fa-image text-muted"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="fw-bold mb-0 text-primary">{c.citizenName || "Guest"}</p>
                                                    <span className="badge bg-light text-dark border small">{c.category || c.type}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="mb-0 text-truncate" style={{ maxWidth: '200px' }} title={c.description}>{c.description}</p>
                                            <small className="text-muted">{new Date(c.createdAt).toLocaleDateString()}</small>
                                        </td>
                                        <td>
                                            <div className="small">
                                                <p className="mb-0"><strong>City:</strong> {c.city}</p>
                                                <p className="mb-0"><strong>Zone:</strong> {c.zone}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${c.priority === 'High' ? 'bg-danger' : c.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-info'}`}>
                                                {c.priority || "Medium"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge rounded-pill" style={{ backgroundColor: `${STATUS_COLORS[c.status || 'Pending']}15`, color: STATUS_COLORS[c.status || 'Pending'], border: `1px solid ${STATUS_COLORS[c.status || 'Pending']}30` }}>
                                                {c.status || "Pending"}
                                            </span>
                                        </td>
                                        <td>
                                            {c.feedbackRating > 0 ? (
                                                <div className="d-flex align-items-center gap-1">
                                                    <span className="text-warning small">
                                                        {[...Array(c.feedbackRating)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                                                        {[...Array(5 - c.feedbackRating)].map((_, i) => <i key={i} className="far fa-star"></i>)}
                                                    </span>
                                                    <span className="small text-muted ms-1">{c.feedbackRating}/5</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted small">{c.status === 'Resolved' ? '⏳ Pending' : '—'}</span>
                                            )}
                                        </td>
                                        <td className="text-end pe-4">
                                            <button className="btn btn-sm btn-outline-info" onClick={() => setSelectedComplaint(c)}>
                                                <i className="fas fa-eye me-1"></i> View & Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedComplaint && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title fw-bold">Manage Complaint</h5>
                                <button type="button" className="btn-close" onClick={() => { setSelectedComplaint(null); setIsAssigning(false); }}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="row g-4">
                                    <div className="col-md-6 text-center">
                                        {selectedComplaint.imageUrl ? (
                                            <img src={resolveMediaUrl(selectedComplaint.imageUrl)} alt="Issue" className="img-fluid rounded shadow-sm border" style={{ maxHeight: '400px', width: '100%', objectFit: 'contain', background: '#f8f9fa' }} />
                                        ) : (
                                            <div className="bg-light rounded d-flex align-items-center justify-content-center border" style={{ height: '300px' }}>
                                                <i className="fas fa-image fa-4x text-muted"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <span className="badge rounded-pill mb-2" style={{ backgroundColor: `${STATUS_COLORS[selectedComplaint.status || 'Pending']}15`, color: STATUS_COLORS[selectedComplaint.status || 'Pending'], border: `1px solid ${STATUS_COLORS[selectedComplaint.status || 'Pending']}30` }}>
                                                {selectedComplaint.status || "Pending"}
                                            </span>
                                            <h3 className="fw-bold mb-0">{selectedComplaint.category || selectedComplaint.type}</h3>
                                            <div className="d-flex gap-2 align-items-center mt-1">
                                                <span className={`badge ${selectedComplaint.priority === 'High' ? 'bg-danger' : selectedComplaint.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-info'}`}>
                                                    Priority: {selectedComplaint.priority || "Medium"}
                                                </span>
                                                <small className="text-muted">Reported on {new Date(selectedComplaint.createdAt).toLocaleString()}</small>
                                            </div>
                                        </div>

                                        <hr />

                                        <div className="mc-response-section mb-3">
                                            <h6 className="fw-bold mb-2 small text-uppercase text-muted">MC Response / Communication</h6>
                                            <div className="d-flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Message to citizen..."
                                                    value={note}
                                                    onChange={(e) => setNote(e.target.value)}
                                                />
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={async () => {
                                                        if (!note) return toast.warning("Enter a message");
                                                        try {
                                                            await api.patch(`/complaints/${selectedComplaint._id}/status`, { mcResponse: note });
                                                            toast.success("Message sent to citizen!");
                                                            fetchComplaints();
                                                            setNote("");
                                                        } catch (err) { toast.error("Failed to send message"); }
                                                    }}
                                                >
                                                    Send
                                                </button>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-warning small py-1"
                                                    style={{ fontSize: '0.7rem' }}
                                                    onClick={() => setNote("This area is already being cleaned. Any other complaint you can send me.")}
                                                >
                                                    Mark as Duplicate Notice
                                                </button>
                                            </div>
                                            {selectedComplaint.mcResponse && (
                                                <div className="mt-2 p-2 bg-light border rounded small italic">
                                                    <strong>Sent:</strong> {selectedComplaint.mcResponse}
                                                </div>
                                            )}
                                        </div>

                                        <hr />

                                        {selectedComplaint.status === "Pending" && !isAssigning && (
                                            <div className="d-grid gap-2 mb-3">
                                                <button className="btn btn-primary" onClick={() => setIsAssigning(true)}>Assign Worker & Deadline</button>
                                            </div>
                                        )}

                                        {isAssigning && (
                                            <div className="bg-light p-3 rounded mb-3 border">
                                                <h6 className="fw-bold mb-3">Worker Assignment</h6>
                                                <div className="mb-2">
                                                    <label className="small fw-bold">Select Worker</label>
                                                    <select className="form-select" value={assignData.workerId} onChange={(e) => setAssignData({ ...assignData, workerId: e.target.value })}>
                                                        <option value="">Choose Worker...</option>
                                                        {displayWorkers.map((w) => (<option key={w._id} value={w._id}>{w.name} ({w.role})</option>))}
                                                    </select>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="small fw-bold">Set Deadline</label>
                                                    <input type="date" className="form-control" value={assignData.deadline} onChange={(e) => setAssignData({ ...assignData, deadline: e.target.value })} />
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-success flex-grow-1" onClick={handleAssign}>Confirm Assignment</button>
                                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setIsAssigning(false)}>Cancel</button>
                                                </div>
                                            </div>
                                        )}

                                        {selectedComplaint.status === "In Process" && (
                                            <div className="bg-light p-3 rounded mb-3 border">
                                                <h6 className="fw-bold mb-3 text-success"><i className="fas fa-check-circle me-2"></i>Mark as Resolved</h6>
                                                <div className="mb-2">
                                                    <label className="small fw-bold">Upload Proof Image</label>
                                                    <input type="file" className="form-control" onChange={(e) => setProofFile(e.target.files[0])} />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="small fw-bold">Resolution Note</label>
                                                    <textarea className="form-control" rows="2" placeholder="Explain what was done..." value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                                                </div>
                                                <button className="btn btn-success w-100" onClick={handleResolve}>Submit Resolution</button>
                                            </div>
                                        )}

                                        {selectedComplaint.status === "Resolved" && (
                                            <div className="bg-success bg-opacity-10 p-3 rounded mb-3 border border-success">
                                                <h6 className="fw-bold text-success mb-2">Resolution Details</h6>
                                                <p className="small mb-1"><strong>Note:</strong> {selectedComplaint.completionNote || "Cleaned successfully."}</p>
                                                {selectedComplaint.proofImage && (
                                                    <div className="mt-2">
                                                        <label className="small fw-bold d-block mb-1">Proof Image:</label>
                                                        <img src={resolveMediaUrl(selectedComplaint.proofImage)} alt="Proof" className="rounded" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {selectedComplaint.status === "Resolved" && selectedComplaint.feedbackRating > 0 && (
                                            <div className="p-3 rounded mb-3 border" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
                                                <h6 className="fw-bold mb-2" style={{ color: '#92400e' }}>
                                                    <i className="fas fa-star me-2 text-warning"></i>Citizen Feedback
                                                </h6>
                                                <div className="text-warning mb-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i key={i} className={`${i < selectedComplaint.feedbackRating ? 'fas' : 'far'} fa-star me-1`}></i>
                                                    ))}
                                                    <span className="ms-2 small fw-bold text-dark">{selectedComplaint.feedbackRating}/5</span>
                                                </div>
                                                <p className="small text-muted mb-0 fst-italic">"{selectedComplaint.feedbackComment}"</p>
                                                <small className="text-muted d-block mt-1">
                                                    — {selectedComplaint.citizenName || 'Citizen'} &nbsp;·&nbsp; {new Date(selectedComplaint.updatedAt).toLocaleDateString()}
                                                </small>
                                            </div>
                                        )}

                                        {selectedComplaint.status === "Resolved" && !selectedComplaint.feedbackRating && (
                                            <div className="p-3 rounded mb-3 border text-muted small" style={{ background: '#f8fafc' }}>
                                                <i className="fas fa-clock me-2 opacity-50"></i>Awaiting citizen feedback...
                                            </div>
                                        )}

                                        <div className="row g-3 mt-1">
                                            <div className="col-sm-6">
                                                <label className="text-muted small fw-bold d-block text-uppercase">Reported By</label>
                                                <p className="fw-bold mb-0">{selectedComplaint.citizenName || "Guest"}</p>
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="text-muted small fw-bold d-block text-uppercase">Ward / Zone</label>
                                                <p className="mb-0">{selectedComplaint.ward} | {selectedComplaint.zone}</p>
                                            </div>
                                            <div className="col-12">
                                                <label className="text-muted small fw-bold d-block text-uppercase">Specific Location</label>
                                                <p className="mb-0"><i className="fas fa-map-marker-alt text-danger me-2"></i>{selectedComplaint.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer bg-light border-0">
                                <button type="button" className="btn btn-secondary px-4" onClick={() => { setSelectedComplaint(null); setIsAssigning(false); }}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageComplaints;
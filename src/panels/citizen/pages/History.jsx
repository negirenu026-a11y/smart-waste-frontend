import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import { useSearch } from '../../../context/SearchContext';

const History = () => {
    const { searchTerm } = useSearch();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await api.get("/complaints");
            setComplaints(res.data.complaints || []);
        } catch (err) {
            console.error("Error fetching history:", err);
            toast.error("Failed to load complaint history.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-success';
            case 'In Process': return 'bg-warning text-dark';
            default: return 'bg-danger';
        }
    };
    const filteredComplaints = (complaints || []).filter(c => 
        Object.values(c).some(val => 
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Complaint History</h2>
                <p className="text-muted">Track the status of your previously submitted complaints.</p>
            </header>

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Type</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-5">Loading history...</td></tr>
                            ) : filteredComplaints.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-5">
                                        <div className="text-muted mb-3">
                                            <i className="fas fa-search fa-3x opacity-25 mb-2"></i>
                                            <p>No matching results found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredComplaints.map((c) => (
                                    <tr key={c._id}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center gap-3">
                                                {c.imageUrl && (
                                                    <img src={`http://localhost:4000${c.imageUrl}`} alt="Issue" className="rounded" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                                )}
                                                <span className="fw-bold text-primary">{c.category || c.type}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="small text-muted d-block">{c.city}, {c.zone}</span>
                                            <span className="fw-semibold">{c.location}</span>
                                        </td>
                                        <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge rounded-pill ${getStatusBadge(c.status)}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedComplaint(c)}>
                                                <i className="fas fa-eye me-1"></i> Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedComplaint && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title fw-bold">Complaint Details</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedComplaint(null)}></button>
                            </div>
                            <div className="modal-body p-4">
                                {selectedComplaint.imageUrl && (
                                    <div className="mb-4 text-center">
                                        <img src={`http://localhost:4000${selectedComplaint.imageUrl}`} alt="Issue" className="img-fluid rounded shadow-sm border" style={{ maxHeight: '250px' }} />
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label className="text-muted small fw-bold d-block text-uppercase">Status</label>
                                    <span className={`badge rounded-pill ${getStatusBadge(selectedComplaint.status)}`}>
                                        {selectedComplaint.status}
                                    </span>
                                </div>
                                <div className="mb-3">
                                    <label className="text-muted small fw-bold d-block text-uppercase">Category</label>
                                    <p className="fw-bold">{selectedComplaint.category || selectedComplaint.type}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="text-muted small fw-bold d-block text-uppercase">Description</label>
                                    <div className="p-3 bg-light rounded italic">{selectedComplaint.description || "No description provided."}</div>
                                </div>
                                <div className="mb-3">
                                    <label className="text-muted small fw-bold d-block text-uppercase">Location</label>
                                    <p className="mb-0">{selectedComplaint.location}, {selectedComplaint.ward}</p>
                                    <p className="small text-muted">{selectedComplaint.city}, {selectedComplaint.zone}</p>
                                </div>

                                {selectedComplaint.status === "Resolved" && (
                                    <div className="mt-4 p-3 border border-success rounded bg-success bg-opacity-10">
                                        <h6 className="fw-bold text-success mb-2"><i className="fas fa-check-circle me-2"></i>Issue Resolved</h6>
                                        <p className="small mb-2"><strong>Message:</strong> {selectedComplaint.completionNote || "Your issue has been resolved."}</p>
                                        {selectedComplaint.proofImage && (
                                            <div className="text-center mt-2 mb-3">
                                                <label className="small fw-bold d-block text-muted text-start mb-1">Resolution Proof:</label>
                                                <img src={`http://localhost:4000${selectedComplaint.proofImage}`} alt="Proof" className="img-fluid rounded border shadow-sm" style={{ maxHeight: '200px' }} />
                                            </div>
                                        )}

                                        <div className="feedback-section border-top pt-3">
                                            <label className="small fw-bold d-block mb-1 text-muted text-uppercase">Rate our Service</label>
                                            {selectedComplaint.feedbackRating ? (
                                                <div className="text-warning fs-5">
                                                    {'★'.repeat(selectedComplaint.feedbackRating)}
                                                    <span className="ms-2 text-muted small">Rating Saved</span>
                                                </div>
                                            ) : (
                                                <div className="d-flex gap-2 fs-4">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <i
                                                            key={star}
                                                            className="far fa-star text-warning"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={async () => {
                                                                try {
                                                                    const res = await api.patch(`/complaints/${selectedComplaint._id}/feedback`, { rating: star, comment: 'Thank you!' });
                                                                    if (res.data.success) {
                                                                        toast.success("Thank you for your rating!");
                                                                        setSelectedComplaint({ ...selectedComplaint, feedbackRating: star });
                                                                        fetchHistory();
                                                                    }
                                                                } catch (err) {
                                                                    toast.error("Failed to save rating.");
                                                                }
                                                            }}
                                                        ></i>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer bg-light border-0">
                                <button type="button" className="btn btn-secondary px-4" onClick={() => setSelectedComplaint(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;

import React from 'react';

const ComplaintList = ({ complaints, onEdit, onDelete }) => {
    return (
        <div className="row g-4">
            {complaints.length === 0 ? (
                <div className="col-12 text-center py-5 text-muted">
                    <p>No complaints found.</p>
                </div>
            ) : (
                complaints.map((item) => (
                    <div key={item.id} className="col-md-6">
                        <div className="card h-100 shadow-sm border-0">
                            {item.image && (
                                <img src={item.image} className="card-img-top" alt="Evidence" style={{ height: '180px', objectFit: 'cover' }} />
                            )}
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="card-title fw-bold mb-0">{item.title}</h6>
                                    <span className={`badge ${item.status === 'Resolved' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                        {item.status}
                                    </span>
                                </div>
                                <p className="card-text small text-muted mb-3">{item.description}</p>
                                <div className="row g-2 small mb-3">
                                    <div className="col-6"><strong>Category:</strong> {item.category}</div>
                                    <div className="col-6"><strong>Area:</strong> {item.area}</div>
                                    <div className="col-6"><strong>Zone:</strong> {item.zone}</div>
                                    <div className="col-6"><strong>Ward:</strong> {item.ward}</div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-outline-primary flex-fill" onClick={() => onEdit(item)}>
                                        <i className="fas fa-edit me-1"></i> Edit
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger flex-fill" onClick={() => onDelete(item.id)}>
                                        <i className="fas fa-trash me-1"></i> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ComplaintList;

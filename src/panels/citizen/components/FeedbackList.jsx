import React from 'react';

const FeedbackList = ({ feedbacks, onEdit, onDelete }) => {
    return (
        <div className="feedback-list">
            {feedbacks.length === 0 ? (
                <p className="text-center text-muted py-4">No feedback yet.</p>
            ) : (
                feedbacks.map((f) => (
                    <div key={f.id} className="card mb-3 border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h6 className="fw-bold mb-0">{f.name}</h6>
                                    <div className="text-warning small">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`${i < f.rating ? 'fas' : 'far'} fa-star`}></i>
                                        ))}
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm text-primary p-0" onClick={() => onEdit(f)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="btn btn-sm text-danger p-0" onClick={() => onDelete(f.id)}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <p className="small text-muted mb-0">{f.message}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default FeedbackList;

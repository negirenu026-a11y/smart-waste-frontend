import React, { useState, useEffect } from 'react';

const FeedbackForm = ({ onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({ name: "", message: "", rating: 5 });

    useEffect(() => {
        if (initialData) setFormData(initialData);
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        if (!initialData) setFormData({ name: "", message: "", rating: 5 });
    };

    return (
        <form onSubmit={handleSubmit} className="p-3 bg-light rounded shadow-sm">
            <h6 className="fw-bold mb-3">{initialData ? "Edit Feedback" : "Give Your Feedback"}</h6>
            <div className="mb-3">
                <label className="form-label small fw-bold">Name</label>
                <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="mb-3">
                <label className="form-label small fw-bold">Rating (1-5)</label>
                <select className="form-select" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})}>
                    {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label small fw-bold">Message</label>
                <textarea className="form-control" rows="3" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required></textarea>
            </div>
            <button type="submit" className="btn btn-success w-100">
                {initialData ? "Save Changes" : "Submit Feedback"}
            </button>
        </form>
    );
};

export default FeedbackForm;

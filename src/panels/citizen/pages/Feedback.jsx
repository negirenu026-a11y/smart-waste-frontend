import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const res = await api.get("/feedback");
            setFeedbacks(res.data.feedback || []);
        } catch (err) {
            console.error("Error fetching feedback:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFeedbackSubmit = async (data) => {
        try {
            const res = await api.post("/feedback", data);
            if (res.data.success) {
                toast.success("Feedback submitted!");
                fetchFeedbacks();
            }
        } catch (err) {
            toast.error("Failed to submit feedback.");
        }
    };

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Citizen Feedback</h2>
                <p className="text-muted">Your opinion matters. Help us improve our waste management services.</p>
            </header>

            <div className="row g-4">
                <div className="col-lg-5">
                    <FeedbackForm onSubmit={handleFeedbackSubmit} />
                </div>
                <div className="col-lg-7">
                    {loading ? (
                        <div className="text-center py-5">Loading feedback...</div>
                    ) : (
                        <FeedbackList feedbacks={feedbacks} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Feedback;
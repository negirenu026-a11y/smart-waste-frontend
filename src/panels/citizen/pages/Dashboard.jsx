import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../../utils/api";

const CitizenDashboard = () => {
    const { user } = useOutletContext();
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProcess: 0,
        resolved: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await api.get("/complaints");
                const userComplaints = res.data.complaints || [];

                setStats({
                    total: userComplaints.length,
                    pending: userComplaints.filter(c => c.status === 'Pending').length,
                    inProcess: userComplaints.filter(c => c.status === 'In Process').length,
                    resolved: userComplaints.filter(c => c.status === 'Resolved').length
                });
            } catch (err) {
                console.error("Failed to fetch citizen stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const displayUser = {
        name: user?.fullName || user?.name || "Guest Citizen",
        email: user?.email || "Not Provided",
        city: user?.city || "Not Set",
        zone: user?.zone || "Not Set",
        ward: user?.ward || "Not Set",
        phone: user?.phone || "Not Set"
    };

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Citizen Dashboard</h2>
                <p className="text-muted">Welcome back, {displayUser.name}!</p>
            </header>

            <div className="row g-4 mb-5">
                <div className="col-md-7">
                    <div className="dashboard-card p-4 h-100 shadow-sm border-0 bg-white">
                        <h5 className="fw-bold mb-4 border-bottom pb-2">Profile Overview</h5>
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <p className="text-muted small mb-1 uppercase fw-bold">Full Name</p>
                                <p className="fw-semibold">{displayUser.name}</p>
                            </div>
                            <div className="col-sm-6">
                                <p className="text-muted small mb-1 uppercase fw-bold">Email Address</p>
                                <p className="fw-semibold">{displayUser.email}</p>
                            </div>
                            <div className="col-sm-4">
                                <p className="text-muted small mb-1 uppercase fw-bold">City</p>
                                <p className="fw-semibold">{displayUser.city}</p>
                            </div>
                            <div className="col-sm-4">
                                <p className="text-muted small mb-1 uppercase fw-bold">Zone</p>
                                <p className="fw-semibold">{displayUser.zone}</p>
                            </div>
                            <div className="col-sm-4">
                                <p className="text-muted small mb-1 uppercase fw-bold">Ward</p>
                                <p className="fw-semibold">{displayUser.ward}</p>
                            </div>
                            <div className="col-sm-12">
                                <p className="text-muted small mb-1 uppercase fw-bold">Phone</p>
                                <p className="fw-semibold">{displayUser.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="dashboard-card p-4 h-100 shadow-sm border-0 bg-primary text-white">
                        <h5 className="fw-bold mb-4 border-bottom border-white border-opacity-25 pb-2">Your Activity</h5>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h1 className="display-4 fw-bold mb-0">{loading ? "..." : stats.total}</h1>
                                <p className="mb-0 opacity-75">Total Complaints</p>
                            </div>
                            <i className="fas fa-file-invoice fa-4x opacity-25"></i>
                        </div>
                        <div className="row text-center g-2">
                            <div className="col-4">
                                <div className="bg-white bg-opacity-10 p-2 rounded">
                                    <h4 className="fw-bold mb-0">{loading ? "..." : stats.pending}</h4>
                                    <p className="small mb-0 opacity-75">Pending</p>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="bg-white bg-opacity-10 p-2 rounded">
                                    <h4 className="fw-bold mb-0">{loading ? "..." : stats.inProcess}</h4>
                                    <p className="small mb-0 opacity-75">In Process</p>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="bg-white bg-opacity-10 p-2 rounded">
                                    <h4 className="fw-bold mb-0">{loading ? "..." : stats.resolved}</h4>
                                    <p className="small mb-0 opacity-75">Resolved</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <h5 className="fw-bold mb-3">System Information</h5>
                <div className="alert alert-info border-0 shadow-sm">
                    <i className="fas fa-info-circle me-2"></i>
                    Track your reported issues in real-time. Our municipal teams are working to resolve them as quickly as possible.
                </div>
            </div>
        </div>
    );
};

export default CitizenDashboard;
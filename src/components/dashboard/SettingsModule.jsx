import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';

const SettingsModule = () => {
    const { user } = useOutletContext();
    const [theme, setTheme] = useState(localStorage.getItem('wastewise-theme') || 'light');
    const [language, setLanguage] = useState('English');
    const [notifications, setNotifications] = useState(true);
    const accentColor = "#10b981";

    useEffect(() => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('wastewise-theme', theme);
    }, [theme]);

    return (
        <div className="dashboard-section-wrap">
            <header className="mb-4">
                <h2 className="fw-bold">System Settings</h2>
                <p className="text-muted">Manage your account preferences, security, and notification settings.</p>
            </header>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="dashboard-card p-4 h-100">
                        <h5 className="mb-4"><i className="fas fa-user-cog me-2" style={{ color: accentColor }}></i>Profile Settings</h5>
                        <form onSubmit={(e) => { e.preventDefault(); toast.success('Profile updated!'); }}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Full Name</label>
                                <input className="form-control" defaultValue={user?.fullName || user?.name} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Email Address</label>
                                <input className="form-control" defaultValue={user?.email} readOnly />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold">Profile Photo</label>
                                <div className="d-flex align-items-center">
                                    <div className="avatar-sm bg-success text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{width: 50, height: 50, fontSize: '1.5rem', backgroundColor: accentColor}}>
                                        {(user?.fullName || user?.name || "U")[0]}
                                    </div>
                                    <button type="button" className="btn btn-sm btn-outline-secondary">Change Photo</button>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success btn-sm px-4" style={{ backgroundColor: accentColor, border: 'none' }}>Update Profile</button>
                        </form>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="dashboard-card p-4 h-100">
                        <h5 className="mb-4"><i className="fas fa-shield-alt me-2" style={{ color: accentColor }}></i>Password & Security</h5>
                        <form onSubmit={(e) => { e.preventDefault(); toast.success('Security settings updated!'); }}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Current Password</label>
                                <input type="password" name="oldPassword" className="form-control" placeholder="••••••••" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">New Password</label>
                                <input type="password" name="newPassword" className="form-control" placeholder="Min 8 characters" />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold">Confirm New Password</label>
                                <input type="password" name="confirmPassword" className="form-control" />
                            </div>
                            <button type="submit" className="btn btn-success btn-sm px-4" style={{ backgroundColor: accentColor, border: 'none' }}>Change Password</button>
                        </form>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="dashboard-card p-4 h-100">
                        <h5 className="mb-4"><i className="fas fa-adjust me-2" style={{ color: accentColor }}></i>Core Features</h5>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h6 className="mb-0 fw-bold">Theme Mode</h6>
                                <p className="text-muted small mb-0">Switch between light and dark themes</p>
                            </div>
                            <div className="btn-group btn-group-sm">
                                <button className={`btn btn-outline-secondary ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>Light</button>
                                <button className={`btn btn-outline-secondary ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>Dark</button>
                            </div>
                        </div>
                       
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="dashboard-card p-4 h-100">
                        <h5 className="mb-4"><i className="fas fa-bell me-2" style={{ color: accentColor }}></i>Notifications & Privacy</h5>
                        <div className="form-check form-switch mb-3">
                            <input className="form-check-input" type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
                            <label className="form-check-label">Enable desktop notifications</label>
                        </div>
                        <div className="form-check form-switch mb-3">
                            <input className="form-check-input" type="checkbox" defaultChecked />
                            <label className="form-check-label">Public profile visibility</label>
                        </div>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" defaultChecked />
                            <label className="form-check-label">Sound alerts for new complaints</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModule;


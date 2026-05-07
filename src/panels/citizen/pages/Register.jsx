import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import { useOutletContext } from 'react-router-dom';

const districtCityData = {
    Shimla: ["Shimla", "Rohru", "Rampur", "Theog"],
    Kullu: ["Kullu", "Manali", "Banjar", "Bhuntar"],
    Mandi: ["Mandi", "Sundernagar", "Jogindernagar"],
    Kangra: ["Dharamshala", "Palampur", "Kangra"],
    Una: ["Una", "Amb", "Haroli"],
    Solan: ["Solan", "Baddi", "Nalagarh"],
    Sirmaur: ["Nahan", "Paonta Sahib", "Rajgarh"],
    Chamba: ["Chamba", "Dalhousie", "Bharmour"],
    Bilaspur: ["Bilaspur", "Ghumarwin", "Jhandutta"],
    Hamirpur: ["Hamirpur", "Nadaun", "Barsar"],
    Kinnaur: ["Reckong Peo", "Kalpa", "Sangla"],
    Lahaul_and_Spiti: ["Keylong", "Kaza", "Udaipur"]
};

const Register = () => {
    const { user } = useOutletContext();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        district: '',
        city: '',
        area: '',
        zone: '',
        ward: '',
        location: '',
        phone: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.fullName || user.name || '',
                email: user.email || '',
                district: user.district || '',
                city: user.city || '',
                area: user.area || '',
                zone: user.zone || '',
                ward: user.ward || '',
                location: user.location || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'district') updated.city = '';
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mobile Number Validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error("Please enter a valid 10-digit mobile number.");
            return;
        }

        try {
            const res = await api.patch("/profile", formData);
            if (res.data.success) {
                toast.success('Registration details updated successfully!');
                localStorage.setItem("wastewise-user", JSON.stringify(res.data.user));
            }
        } catch (err) {
            toast.error("Failed to update registration details.");
        }
    };

    const availableDistricts = Object.keys(districtCityData);
    const filteredCities = formData.district ? districtCityData[formData.district] : [];

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Register Itself</h2>
                <p className="text-muted">Update your personal and residential details to help us serve you better.</p>
            </header>

            <div className="dashboard-card p-4 shadow-sm border-0 bg-white">
                <form onSubmit={handleSubmit} className="row g-4">
                    <div className="col-md-6">
                        <label className="form-label fw-bold small text-uppercase">Full Name</label>
                        <input type="text" name="name" className="form-control p-3 bg-light border-0" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold small text-uppercase">Email Address (Read-only)</label>
                        <input type="email" name="email" className="form-control p-3 bg-light border-0" value={formData.email} readOnly />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">Phone Number</label>
                        <input type="text" name="phone" className="form-control p-3 bg-light border-0" placeholder="Phone number" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">District</label>
                        <select name="district" className="form-select p-3 bg-light border-0" value={formData.district} onChange={handleChange} required>
                            <option value="">Select District</option>
                            {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">City</label>
                        <select name="city" className="form-select p-3 bg-light border-0" value={formData.city} onChange={handleChange} required disabled={!formData.district}>
                            <option value="">Select City</option>
                            {filteredCities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">Area Name</label>
                        <input type="text" name="area" className="form-control p-3 bg-light border-0" placeholder="e.g. Mall Road" value={formData.area} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">Ward Number</label>
                        <input type="text" name="ward" className="form-control p-3 bg-light border-0" placeholder="e.g. Ward 12" value={formData.ward} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">Zone</label>
                        <input type="text" name="zone" className="form-control p-3 bg-light border-0" placeholder="e.g. North" value={formData.zone} onChange={handleChange} required />
                    </div>
                    <div className="col-12 mt-5 text-end">
                        <button type="submit" className="btn btn-primary px-5 py-3 shadow-sm fw-bold">
                            Update Registration Data
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;

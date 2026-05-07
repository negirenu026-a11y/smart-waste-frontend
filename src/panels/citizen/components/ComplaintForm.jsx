import React, { useState, useEffect } from 'react';

const ComplaintForm = ({ onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        area: "",
        city: "",
        zone: "North",
        ward: "",
        category: "Dry Waste",
        image: ""
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: URL.createObjectURL(file) });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        if (!initialData) {
            setFormData({
                title: "",
                description: "",
                area: "",
                city: "",
                zone: "North",
                ward: "",
                category: "Dry Waste",
                image: ""
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
                <label className="form-label fw-bold">Complaint Title</label>
                <input type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="col-md-6">
                <label className="form-label fw-bold">Category</label>
                <select name="category" className="form-select" value={formData.category} onChange={handleInputChange}>
                    <option>Dry Waste</option>
                    <option>Wet Waste</option>
                    <option>Plastic</option>
                    <option>Medical</option>
                    <option>Other</option>
                </select>
            </div>
            <div className="col-12">
                <label className="form-label fw-bold">Description</label>
                <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleInputChange} required></textarea>
            </div>
            <div className="col-md-4">
                <label className="form-label fw-bold">City</label>
                <input type="text" name="city" className="form-control" value={formData.city} onChange={handleInputChange} required />
            </div>
            <div className="col-md-4">
                <label className="form-label fw-bold">Area</label>
                <input type="text" name="area" className="form-control" value={formData.area} onChange={handleInputChange} required />
            </div>
            <div className="col-md-2">
                <label className="form-label fw-bold">Zone</label>
                <select name="zone" className="form-select" value={formData.zone} onChange={handleInputChange}>
                    <option>North</option>
                    <option>South</option>
                    <option>East</option>
                    <option>West</option>
                </select>
            </div>
            <div className="col-md-2">
                <label className="form-label fw-bold">Ward</label>
                <input type="text" name="ward" className="form-control" value={formData.ward} onChange={handleInputChange} required />
            </div>
            <div className="col-12">
                <label className="form-label fw-bold">Image Upload</label>
                <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                {formData.image && (
                    <div className="mt-2">
                        <img src={formData.image} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }} />
                    </div>
                )}
            </div>
            <div className="col-12 mt-4">
                <button type="submit" className="btn btn-success w-100">
                    {initialData ? "Update Complaint" : "Submit Complaint"}
                </button>
            </div>
        </form>
    );
};

export default ComplaintForm;

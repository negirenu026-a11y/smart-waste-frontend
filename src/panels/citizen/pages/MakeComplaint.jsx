import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import { districts, HIMACHAL_DATA } from '../../../utils/dashboardData';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapController = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, 13);
    }, [center, map]);
    return null;
};

const MakeComplaint = () => {
    const [areas, setAreas] = useState([]);
    const [formData, setFormData] = useState({
        image: null,
        district: '',
        city: '',
        area: '',
        location: '',
        ward: '',
        zone: '',
        category: 'Other',
        description: ''
    });

    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [locating, setLocating] = useState(false);
    const [coords, setCoords] = useState([31.1048, 77.1734]); // Shimla default

    useEffect(() => {
        fetchAvailableAreas();
    }, []);

    const fetchAvailableAreas = async () => {
        try {
            const res = await api.get("/areas");
            setAreas(res.data.areas || []);
        } catch (err) {
            console.error("Error fetching areas:", err);
            toast.error("Failed to load operational areas.");
        }
    };

    const reverseGeocode = async (lat, lon) => {
        try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const address = res.data.address;
            const detectedArea = address.suburb || address.neighbourhood || address.village || address.hamlet || address.residential || "";
            const detectedCity = address.city || address.town || address.village || "";
            const detectedDistrict = address.state_district ? address.state_district.replace(" District", "") : "";
            const pincode = address.postcode || "";

            setFormData(prev => {
                const updated = {
                    ...prev,
                    district: detectedDistrict,
                    city: detectedCity,
                    area: detectedArea,
                    location: pincode ? `Pincode: ${pincode}` : ''
                };

                // Try to find matching area in our DB records to auto-fill zone/ward
                const matchingArea = areas.find(a => 
                    (a.name.toLowerCase() === detectedArea.toLowerCase() || detectedArea.includes(a.name)) && 
                    a.city.toLowerCase() === detectedCity.toLowerCase()
                );

                if (matchingArea) {
                    updated.ward = matchingArea.ward;
                    updated.zone = matchingArea.zone;
                    updated.area = matchingArea.name; // Use standard name from DB
                }

                return updated;
            });

            toast.success("Location detected successfully!");
        } catch (err) {
            console.error("Reverse geocoding error:", err);
            toast.error("Failed to detect address details.");
        }
    };

    const handleUseLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser.");
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setCoords([latitude, longitude]);
                await reverseGeocode(latitude, longitude);
                setLocating(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                toast.error("Permission denied or location unavailable.");
                setLocating(false);
            }
        );
    };

    const handleMarkerDragEnd = async (e) => {
        const { lat, lng } = e.target.getLatLng();
        setCoords([lat, lng]);
        await reverseGeocode(lat, lng);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            
            if (name === 'district') {
                updated.city = '';
                updated.area = '';
                updated.ward = '';
                updated.zone = '';
                updated.location = '';
            } else if (name === 'city') {
                updated.area = '';
                updated.ward = '';
                updated.zone = '';
                updated.location = '';
            } else if (name === 'area') {
                const selectedArea = areas.find(a => a.name === value && a.city === prev.city);
                if (selectedArea) {
                    updated.ward = selectedArea.ward;
                    updated.zone = selectedArea.zone;
                    updated.location = selectedArea.pincode ? `Pincode: ${selectedArea.pincode}` : '';
                    if (selectedArea.coordinates) {
                        setCoords([selectedArea.coordinates.lat, selectedArea.coordinates.lng]);
                    }
                }
            }
            return updated;
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) {
            toast.warning("Please upload an evidence image.");
            return;
        }
        setSubmitting(true);
        
        try {
            const data = new FormData();
            data.append("image", formData.image);
            data.append("district", formData.district);
            data.append("city", formData.city);
            data.append("area", formData.area);
            data.append("location", formData.location);
            data.append("ward", formData.ward);
            data.append("zone", formData.zone);
            data.append("category", formData.category);
            data.append("description", formData.description);

            const res = await api.post("/complaints", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {
                toast.success('Complaint submitted successfully!');
                setFormData({
                    image: null,
                    district: '',
                    city: '',
                    area: '',
                    location: '',
                    ward: '',
                    zone: '',
                    category: 'Other',
                    description: ''
                });
                setPreview(null);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit complaint.");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredCities = formData.district ? HIMACHAL_DATA[formData.district] : [];
    const filteredAreas = areas.filter(a => a.district === formData.district && a.city === formData.city);

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold">Report an Issue</h2>
                    <p className="text-muted">Submit a waste management complaint for your specific area.</p>
                </div>
                <button 
                    type="button" 
                    className="btn btn-primary px-4 py-2 shadow-sm fw-bold d-flex align-items-center gap-2"
                    onClick={handleUseLocation}
                    disabled={locating}
                >
                    {locating ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Detecting Location...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-location-arrow"></i>
                            Use My Current Location
                        </>
                    )}
                </button>
            </header>

            <div className="dashboard-card p-4 shadow-sm border-0 bg-white">
                <form onSubmit={handleSubmit} className="row g-4">
                    <div className="col-md-12">
                        <label className="form-label fw-bold small text-uppercase">Evidence Image</label>
                        <div className="d-flex align-items-center gap-4">
                            <div className="border rounded d-flex align-items-center justify-content-center bg-light shadow-sm" style={{ width: '120px', height: '120px', overflow: 'hidden' }}>
                                {preview ? <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <i className="fas fa-camera fa-2x text-muted"></i>}
                            </div>
                            <div className="flex-grow-1">
                                <input type="file" accept="image/*" className="form-control p-3 shadow-none border-0 bg-light" onChange={handleImageChange} required />
                                <small className="text-muted mt-1 d-block">Upload a clear photo of the waste issue.</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label fw-bold small text-uppercase">District</label>
                        <select name="district" className="form-select p-3 bg-light border-0" value={formData.district} onChange={handleChange} required>
                            <option value="">Select District</option>
                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold small text-uppercase">City</label>
                        <select name="city" className="form-select p-3 bg-light border-0" value={formData.city} onChange={handleChange} required disabled={!formData.district}>
                            <option value="">Select City</option>
                            {filteredCities && filteredCities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold small text-uppercase">Specific Area</label>
                        <select name="area" className="form-select p-3 bg-light border-0" value={formData.area} onChange={handleChange} required disabled={!formData.city}>
                            <option value="">Select Area</option>
                            {filteredAreas.map(a => <option key={a._id} value={a.name}>{a.name}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold small text-uppercase">Category</label>
                        <select name="category" className="form-select p-3 bg-light border-0" value={formData.category} onChange={handleChange} required>
                            <option value="Food Waste">Food Waste</option>
                            <option value="Plastic">Plastic Waste</option>
                            <option value="E-Waste">E-Waste</option>
                            <option value="Hazardous Waste">Hazardous Waste</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">Ward</label>
                        <input type="text" name="ward" className="form-control p-3 bg-light border-0" value={formData.ward} readOnly placeholder="Auto-filled" />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">Zone</label>
                        <input type="text" name="zone" className="form-control p-3 bg-light border-0" value={formData.zone} readOnly placeholder="Auto-filled" />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">Location Info</label>
                        <input type="text" name="location" className="form-control p-3 bg-light border-0" value={formData.location} readOnly placeholder="Auto-filled" />
                    </div>

                    <div className="col-12">
                        <label className="form-label fw-bold small text-uppercase">Interactive Map (Drag marker to adjust location)</label>
                        <div className="dashboard-card p-0 shadow-sm border-0 bg-white overflow-hidden" style={{ height: '350px', borderRadius: '12px' }}>
                            <MapContainer center={coords} zoom={13} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <MapController center={coords} />
                                <Marker 
                                    position={coords} 
                                    draggable={true}
                                    eventHandlers={{ dragend: handleMarkerDragEnd }}
                                >
                                    <Popup>
                                        <div className="p-1">
                                            <h6 className="fw-bold mb-1">Issue Location</h6>
                                            <p className="mb-0 small">{formData.area || "Selected Spot"}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>

                    <div className="col-12">
                        <label className="form-label fw-bold small text-uppercase">Detailed Description</label>
                        <textarea 
                            name="description"
                            className="form-control p-3 bg-light border-0" 
                            rows="4" 
                            placeholder="Please describe the issue in detail..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="col-12 text-end">
                        <button type="submit" className="btn btn-success px-5 py-3 shadow-sm fw-bold rounded-pill" disabled={submitting}>
                            {submitting ? "Submitting..." : "Submit Complaint"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MakeComplaint;

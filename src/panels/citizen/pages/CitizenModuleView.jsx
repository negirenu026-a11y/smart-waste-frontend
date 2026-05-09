import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import { useSearch } from '../../../context/SearchContext';
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

const CitizenModuleView = () => {
    const { searchTerm } = useSearch();
    const [locationMode, setLocationMode] = useState('');
    const [areas, setAreas] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);
    const [allAreas, setAllAreas] = useState([]);
    const [formData, setFormData] = useState({
        image: null,
        district: '',
        city: '',
        area: '',
        location: '',
        ward: '',
        zone: '',
        category: 'Other',
        description: '',
        pincode: ''
    });

    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [locating, setLocating] = useState(false);
    const [coords, setCoords] = useState([31.1048, 77.1734]); // Shimla default
    const [locationError, setLocationError] = useState("");

    const [history, setHistory] = useState([]);
    const [historyFilter, setHistoryFilter] = useState('All');
    const [feedback, setFeedback] = useState({}); // { complaintId: { rating, comment } }

    useEffect(() => {
        fetchDistricts();
        fetchAvailableAreas();
        loadHistory();
    }, []);

    const loadHistory = async () => {
        // Load from LocalStorage first
        const localData = localStorage.getItem('citizen_complaints');
        const localFeedback = localStorage.getItem('citizen_feedback');
        if (localData) setHistory(JSON.parse(localData));
        if (localFeedback) setFeedback(JSON.parse(localFeedback));

        try {
            const res = await api.get("/complaints");
            const serverComplaints = res.data.complaints || [];
            setHistory(serverComplaints);
            localStorage.setItem('citizen_complaints', JSON.stringify(serverComplaints));

            // Sync feedback state from server data
            const serverFeedback = {};
            serverComplaints.forEach(c => {
                if (c.feedbackRating) {
                    serverFeedback[c._id] = { rating: c.feedbackRating, comment: c.feedbackComment };
                }
            });
            setFeedback(prev => ({ ...prev, ...serverFeedback }));
            localStorage.setItem('citizen_feedback', JSON.stringify({ ...feedback, ...serverFeedback }));
        } catch (err) {
            console.error("Error fetching history:", err);
        }
    };

    const fetchDistricts = async () => {
        try {
            const res = await api.get("/districts");
            setDistricts(res.data.districts || []);
        } catch (err) {
            console.error("Error fetching districts:", err);
        }
    };

    const fetchCities = async (district) => {
        try {
            const res = await api.get(`/cities/${district}`);
            setCities(res.data.cities || []);
        } catch (err) {
            console.error("Error fetching cities:", err);
        }
    };

    const fetchAvailableAreas = async () => {
        try {
            const res = await api.get("/areas");
            setAllAreas(res.data.areas || []);
        } catch (err) {
            console.error("Error fetching areas:", err);
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

            setFormData(prev => ({
                ...prev,
                district: detectedDistrict,
                city: detectedCity,
                area: detectedArea,
                location: pincode ? `Pincode: ${pincode}` : '',
                pincode: pincode
            }));
        } catch (err) {
            console.error("Reverse geocoding error:", err);
        }
    };

    const handlePincodeGeocode = async (pin) => {
        try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&postalcode=${pin}&country=India`);
            if (res.data && res.data.length > 0) {
                const { lat, lon } = res.data[0];
                const nLat = parseFloat(lat);
                const nLng = parseFloat(lon);
                setCoords([nLat, nLng]);
                await reverseGeocode(nLat, nLng);
            }
        } catch (err) {
            console.error("Pincode geocoding error:", err);
        }
    };

    const handleUseLocation = async () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation not supported by your browser.");
            setLocationMode('manual');
            return;
        }

        setLocating(true);
        setLocationMode('auto');
        setLocationError("");

        try {
            if (navigator.permissions && navigator.permissions.query) {
                const permission = await navigator.permissions.query({ name: "geolocation" });
                if (permission.state === "denied") {
                    setLocationError("Location access is blocked. Please enable permission in browser settings.");
                    setLocating(false);
                    return;
                }
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setCoords([latitude, longitude]);
                    await reverseGeocode(latitude, longitude);
                    setLocating(false);
                    setLocationError("");
                    toast.success("Precise location fetched!");
                },
                async (error) => {
                    try {
                        const ipRes = await axios.get("https://ipapi.co/json/");
                        const { latitude, longitude, city: ipCity, region: ipRegion } = ipRes.data;
                        if (latitude && longitude) {
                            setCoords([latitude, longitude]);
                            await reverseGeocode(latitude, longitude);
                            setLocationError("");
                            toast.info(`Using approximate location: ${ipCity}, ${ipRegion}`);
                        } else {
                            throw new Error("IP location failed");
                        }
                    } catch (ipErr) {
                        setLocating(false);
                        let msg = "Unable to fetch location. Try manual entry.";
                        if (error.code === error.PERMISSION_DENIED) {
                            msg = "Location access blocked. Using manual mode is recommended.";
                        }
                        setLocationError(msg);
                    } finally {
                        setLocating(false);
                    }
                },
                { timeout: 8000, enableHighAccuracy: true }
            );
        } catch (err) {
            console.error("Permission check error:", err);
            setLocating(false);
        }
    };

    const handleManualMode = () => {
        setLocationMode('manual');
        setLocationError("");
    };

    const handleMarkerDragEnd = async (e) => {
        const { lat, lng } = e.target.getLatLng();
        setCoords([lat, lng]);
        await reverseGeocode(lat, lng);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'district') {
            setCities([]);
            setFormData(prev => ({ ...prev, city: '', area: '', ward: '', zone: '' }));
            if (value) fetchCities(value);
        }

        if (name === 'city') {
            setFormData(prev => ({ ...prev, area: '', ward: '', zone: '' }));
        }

        if (name === 'pincode' && value.length === 6 && locationMode === 'manual') {
            handlePincodeGeocode(value);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) { toast.warning("Upload an image."); return; }

        // Duplicate Warning check
        const similar = history.find(c => c.area === formData.area && c.category === formData.category && c.status !== 'Resolved');
        if (similar) {
            if (!window.confirm("⚠️ Similar complaint already exists in this area. Continue anyway?")) return;
        }

        setSubmitting(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            data.append("lat", coords[0]);
            data.append("lng", coords[1]);
            const res = await api.post("/complaints", data);
            if (res.data.success) {
                toast.success('Complaint submitted successfully!');
                setFormData({ image: null, district: '', city: '', area: '', location: '', ward: '', zone: '', category: 'Other', description: '', pincode: '' });
                setPreview(null);
                loadHistory(); // Refresh
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Submission failed.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleFeedback = async (id, rating, comment) => {
        try {
            const res = await api.patch(`/complaints/${id}/feedback`, { rating, comment });
            if (res.data.success) {
                const newFeedback = { ...feedback, [id]: { rating, comment } };
                setFeedback(newFeedback);
                localStorage.setItem('citizen_feedback', JSON.stringify(newFeedback));
                toast.success("Feedback submitted!");
                loadHistory(); // Refresh to show stars etc
            }
        } catch (err) {
            toast.error("Failed to submit feedback.");
        }
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const filteredByStatus = historyFilter === 'All' ? history : history.filter(c => c.status === historyFilter);

    const filteredHistory = filteredByStatus.filter(c => 
        Object.values(c).some(val => 
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Report an Issue</h2>
                <p className="text-muted">Submit a waste management complaint for your area.</p>
            </header>

            <div className="dashboard-card p-4 shadow-sm border-0 bg-white mb-5">
                <form onSubmit={handleSubmit} className="row g-4">
                    <div className="col-md-12">
                        <label className="form-label fw-bold small text-uppercase">Evidence Image</label>
                        <div className="d-flex align-items-center gap-4">
                            <div className="border rounded d-flex align-items-center justify-content-center bg-light shadow-sm" style={{ width: '120px', height: '120px', overflow: 'hidden' }}>
                                {preview ? <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <i className="fas fa-camera fa-2x text-muted"></i>}
                            </div>
                            <div className="flex-grow-1">
                                <input type="file" accept="image/*" className="form-control" onChange={handleImageChange} required />
                                <small className="text-muted mt-1 d-block">Upload a clear photo of the waste issue.</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <label className="form-label fw-bold small text-uppercase">Location Method</label>
                        <select
                            className="form-select"
                            value={locationMode}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === 'auto') handleUseLocation();
                                else if (val === 'manual') handleManualMode();
                                else setLocationMode("");
                            }}
                        >
                            <option value="">Select Location Option</option>
                            <option value="auto">Use My Current Location</option>
                            <option value="manual">Fill Location Manually</option>
                        </select>
                        {locating && (
                            <div className="mt-2 text-primary small d-flex align-items-center">
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Fetching your location...
                            </div>
                        )}
                        {locationMode === "auto" && locationError && (
                            <div className="alert alert-warning py-2 px-3 mt-2 mb-0 small border-0 bg-warning bg-opacity-10 text-warning d-flex align-items-center rounded">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                <span>Please allow location access in browser or use manual mode.</span>
                            </div>
                        )}
                    </div>

                    {locationMode === 'manual' && (
                        <>
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-uppercase">District</label>
                                <select name="district" className="form-select" value={formData.district} onChange={handleChange} required>
                                    <option value="">Select District</option>
                                    {districts?.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-uppercase">City</label>
                                <select name="city" className="form-select" value={formData.city} onChange={handleChange} required disabled={!formData.district}>
                                    <option value="">Select City</option>
                                    {cities?.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-uppercase">Area Name</label>
                                <input name="area" className="form-control" value={formData.area} onChange={handleChange} required placeholder="e.g. Lower Bazar" />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-uppercase">Pincode</label>
                                <input name="pincode" className="form-control" value={formData.pincode} onChange={handleChange} required placeholder="6-digit PIN" />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-uppercase">Ward / Zone</label>
                                <input name="ward" className="form-control" value={formData.ward} onChange={handleChange} required placeholder="e.g. Ward 12" />
                            </div>
                        </>
                    )}

                    {locationMode === 'auto' && (
                        <>
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-uppercase">Detected Area</label>
                                <input type="text" className="form-control bg-light" value={formData.area} readOnly placeholder="Detecting location..." />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-uppercase">Pincode</label>
                                <input type="text" className="form-control bg-light" value={formData.pincode} readOnly placeholder="Detecting PIN..." />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-uppercase">Ward / Zone</label>
                                <input type="text" className="form-control bg-light" value={formData.ward} readOnly placeholder="Detecting ward..." />
                            </div>
                        </>
                    )}

                    <div className="col-md-12">
                        <label className="form-label fw-bold small text-uppercase">Complaint Category</label>
                        <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
                            {['Food Waste', 'Plastic', 'E-Waste', 'Hazardous', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="col-12">
                        <label className="form-label fw-bold small text-uppercase">Interactive Map (Drag marker to adjust location)</label>
                        <div className="dashboard-card p-0 shadow-sm border-0 bg-white overflow-hidden" style={{ height: '350px', borderRadius: '12px' }}>
                            <MapContainer center={coords} zoom={13} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <MapController center={coords} />
                                <Marker position={coords} draggable={true} eventHandlers={{ dragend: handleMarkerDragEnd }}>
                                    <Popup>Incident Spot</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>

                    <div className="col-12">
                        <label className="form-label fw-bold small text-uppercase">Detailed Description</label>
                        <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange} required placeholder="Describe the issue..."></textarea>
                    </div>

                    <div className="col-12 text-end">
                        <button type="submit" className="btn btn-success px-5 py-3 fw-bold rounded-pill" disabled={submitting}>
                            {submitting ? "Submitting..." : "Submit Complaint"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="history-section mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold mb-0">Recent Activity</h3>
                    <select className="form-select w-auto shadow-sm" value={historyFilter} onChange={(e) => setHistoryFilter(e.target.value)}>
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Process">In Process</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>

                <div className="row g-4">
                    {filteredHistory.map((c) => (
                        <div key={c._id} className="col-md-6 col-lg-4">
                            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white h-100">
                                <div className="position-relative">
                                    <img src={`http://localhost:4000${c.imageUrl}`} className="w-100" style={{ height: '180px', objectFit: 'cover' }} alt="Complaint" />
                                    <span className={`badge position-absolute top-0 end-0 m-3 ${c.status === 'Resolved' ? 'bg-success' : c.status === 'In Process' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                                        {c.status}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="fw-bold mb-0 text-primary">{c.category}</h5>
                                        <small className="text-muted">{getTimeAgo(c.createdAt)}</small>
                                    </div>
                                    <p className="small text-muted mb-3"><i className="fas fa-map-marker-alt me-2 text-danger"></i>{c.location || c.area}</p>

                                    <div className="timeline-wrap mb-4">
                                        <label className="small fw-bold text-uppercase text-muted d-block mb-2" style={{ fontSize: '0.65rem' }}>Status Timeline</label>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="rounded-circle bg-success" style={{ width: '8px', height: '8px' }}></div>
                                            <div className="flex-grow-1 bg-light" style={{ height: '2px' }}>
                                                <div className="bg-success h-100" style={{ width: c.status !== 'Pending' ? '100%' : '0%' }}></div>
                                            </div>
                                            <div className={`rounded-circle ${c.status !== 'Pending' ? 'bg-success' : 'bg-secondary bg-opacity-25'}`} style={{ width: '8px', height: '8px' }}></div>
                                            <div className="flex-grow-1 bg-light" style={{ height: '2px' }}>
                                                <div className="bg-success h-100" style={{ width: c.status === 'Resolved' ? '100%' : '0%' }}></div>
                                            </div>
                                            <div className={`rounded-circle ${c.status === 'Resolved' ? 'bg-success' : 'bg-secondary bg-opacity-25'}`} style={{ width: '8px', height: '8px' }}></div>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.6rem' }}>
                                            <span>Submitted</span>
                                            <span>Processing</span>
                                            <span>Resolved</span>
                                        </div>
                                    </div>

                                    {c.status === 'Resolved' && (
                                        <div className="resolved-details mt-3 p-3 bg-light rounded border-start border-success border-4">
                                            <h6 className="fw-bold text-success mb-2 small"><i className="fas fa-check-circle me-1"></i> Issue Resolved</h6>
                                            <p className="small mb-2 italic">"{c.completionNote || 'Work completed successfully.'}"</p>

                                            {c.proofImage && (
                                                <div className="before-after-wrap d-flex gap-2 mb-3">
                                                    <div className="flex-1 text-center">
                                                        <small className="d-block text-muted mb-1" style={{ fontSize: '0.6rem' }}>Before</small>
                                                        <img src={`http://localhost:4000${c.imageUrl}`} className="rounded border w-100" style={{ height: '60px', objectFit: 'cover' }} alt="Before" />
                                                    </div>
                                                    <div className="flex-1 text-center">
                                                        <small className="d-block text-muted mb-1" style={{ fontSize: '0.6rem' }}>After</small>
                                                        <img src={`http://localhost:4000${c.proofImage}`} className="rounded border w-100" style={{ height: '60px', objectFit: 'cover' }} alt="After" />
                                                    </div>
                                                </div>
                                            )}

                                            {!feedback[c._id] ? (
                                                <div className="feedback-form mt-2 pt-2 border-top">
                                                    <label className="small fw-bold d-block mb-1">Rate Resolution</label>
                                                    <div className="d-flex gap-1 mb-2">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <i key={star} className="far fa-star text-warning" style={{ cursor: 'pointer' }} onClick={() => handleFeedback(c._id, star, 'Thank you!')}></i>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="feedback-done mt-2 small text-muted">
                                                    <span className="text-warning">{'★'.repeat(feedback[c._id].rating)}</span> Feedback saved locally.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredHistory.length === 0 && (
                        <div className="col-12 text-center py-5 text-muted">
                            <i className="fas fa-search fa-3x mb-3 opacity-25"></i>
                            <p>No matching results found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CitizenModuleView;

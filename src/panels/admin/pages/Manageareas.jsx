import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { useSearch } from "../../../context/SearchContext";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

const Manageareas = () => {
    const { searchTerm } = useSearch();
    const [areas, setAreas] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        name: "",
        district: "",
        city: "",
        zone: "",
        ward: "",
        pincode: "",
        lat: 31.1048,
        lng: 77.1734
    });
    const [editingArea, setEditingArea] = useState(null);
    const [mapCenter, setMapCenter] = useState([31.1048, 77.1734]);

    useEffect(() => {
        fetchAreas();
        fetchDistricts();
    }, []);

    const fetchAreas = async () => {
        try {
            setLoading(true);
            const res = await api.get("/areas");
            setAreas(res.data.areas || []);
        } catch (err) {
            toast.error("Failed to load operational areas.");
        } finally {
            setLoading(false);
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

    const handleGeocode = async (pin) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${pin}&country=India&format=json`);
            const data = await res.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const nLat = parseFloat(lat);
                const nLng = parseFloat(lon);
                setForm(prev => ({ ...prev, lat: nLat, lng: nLng }));
                setMapCenter([nLat, nLng]);
                toast.success("Location detected via PIN Code");
            }
        } catch (err) {
            console.error("Geocoding error:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === 'district') {
            setCities([]);
            setForm(prev => ({ ...prev, city: '' }));
            if (value) fetchCities(value);
        }

        if (name === 'pincode' && value.length === 6) {
            handleGeocode(value);
        }
    };

    const handleAddArea = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, coordinates: { lat: parseFloat(form.lat), lng: parseFloat(form.lng) } };
            const res = await api.post("/areas", payload);
            if (res.data.success) {
                toast.success("Area registered successfully!");
                resetForm();
                fetchAreas();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add area.");
        }
    };

    const handleUpdateArea = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, coordinates: { lat: parseFloat(form.lat), lng: parseFloat(form.lng) } };
            const res = await api.patch(`/areas/${editingArea._id}`, payload);
            if (res.data.success) {
                toast.success("Area updated successfully!");
                resetForm();
                fetchAreas();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update area.");
        }
    };

    const startEdit = (area) => {
        setEditingArea(area);
        const lat = area.coordinates?.lat || 31.1048;
        const lng = area.coordinates?.lng || 77.1734;
        setForm({
            name: area.name,
            district: area.district,
            city: area.city,
            zone: area.zone,
            ward: area.ward,
            pincode: area.pincode || "",
            lat: lat,
            lng: lng
        });
        if (area.district) fetchCities(area.district);
        setMapCenter([lat, lng]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingArea(null);
        setForm({ name: "", district: "", city: "", zone: "", ward: "", pincode: "", lat: 31.1048, lng: 77.1734 });
        setCities([]);
        setMapCenter([31.1048, 77.1734]);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/areas/${id}`);
            toast.success("Area deleted successfully.");
            fetchAreas();
        } catch (err) {
            toast.error("Failed to delete area.");
        }
    };

    const filteredAreas = (areas || []).filter(area => 
        Object.values(area).some(val => 
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold">Manage Operational Areas</h2>
                    <p className="text-muted">Define jurisdictions and geographic zones for MC assignments.</p>
                </div>
            </header>

            <div className="dashboard-card p-4 mb-4 shadow-sm border-0 bg-white">
                <h5 className="fw-bold mb-4">{editingArea ? "Edit Area Details" : "Register New Area"}</h5>
                <form onSubmit={editingArea ? handleUpdateArea : handleAddArea}>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Area Name</label>
                            <input className="form-control" name="name" placeholder="e.g. Lower Bazar"
                                value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">District</label>
                            <select className="form-select" name="district" value={form.district} onChange={handleChange} required>
                                <option value="">Select District</option>
                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">City</label>
                            <select className="form-select" name="city" value={form.city} onChange={handleChange} required disabled={!form.district}>
                                <option value="">Select City</option>
                                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Zone</label>
                            <select className="form-select" name="zone" value={form.zone} onChange={handleChange} required>
                                <option value="">Select Zone</option>
                                <option value="North">North</option>
                                <option value="South">South</option>
                                <option value="East">East</option>
                                <option value="West">West</option>
                                <option value="Center">Center</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Ward No.</label>
                            <input className="form-control" name="ward" placeholder="e.g. Ward 12"
                                value={form.ward} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">PIN Code (Auto-detects location)</label>
                            <input className="form-control" name="pincode" placeholder="e.g. 171001"
                                value={form.pincode} onChange={handleChange} required />
                        </div>

                        <div className="col-12 text-end gap-2 d-flex justify-content-end mt-4">
                            {editingArea && (
                                <button className="btn btn-light px-4" type="button" onClick={resetForm}>Cancel</button>
                            )}
                            <button className="btn btn-primary px-4 fw-bold" type="submit">
                                {editingArea ? "Update Area" : "Register Area"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="row g-4">
                <div className="col-lg-7">
                    <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4">Area Name</th>
                                        <th>Jurisdiction</th>
                                        <th>Zone & Ward</th>
                                        <th className="pe-4 text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={4} className="text-center py-5">Loading operational areas...</td></tr>
                                    ) : filteredAreas.length === 0 ? (
                                        <tr><td colSpan={4} className="text-center text-muted py-5">
                                            <i className="fas fa-search fa-2x mb-2 d-block opacity-25"></i>
                                            No matching results found.
                                        </td></tr>
                                    ) : (
                                        filteredAreas.map((a) => (
                                            <tr key={a._id}>
                                                <td className="ps-4">
                                                    <div className="fw-bold text-primary">{a.name}</div>
                                                </td>
                                                <td>
                                                    <span className="fw-bold">{a.district}</span>
                                                    <span className="text-muted small ms-2">({a.city})</span>
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-column">
                                                        <span className="badge bg-info bg-opacity-10 text-info mb-1" style={{ width: 'fit-content' }}>{a.zone}</span>
                                                        <span className="small text-muted">{a.ward}</span>
                                                    </div>
                                                </td>
                                                <td className="pe-4 text-end">
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(a)}>
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a._id)}>
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-lg-5">
                    <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white" style={{ height: '400px' }}>
                        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <MapController center={mapCenter} />
                            <Marker position={mapCenter}>
                                <Popup>{form.name || "Selected Location"}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Manageareas;
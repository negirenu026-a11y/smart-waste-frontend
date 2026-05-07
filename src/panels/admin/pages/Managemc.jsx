import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { useSearch } from "../../../context/SearchContext";

const Managemc = () => {
    const { searchTerm } = useSearch();
    const [mcUsers, setMcUsers] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        district: "",
        city: "",
        zone: "",
        ward: ""
    });
    const [editingMc, setEditingMc] = useState(null);

    useEffect(() => {
        fetchMCs();
        fetchDistricts();
    }, []);

    const fetchMCs = async () => {
        try {
            setLoading(true);
            const res = await api.get("/mcs");
            setMcUsers(res.data.mcs || []);
        } catch (err) {
            toast.error("Failed to fetch Municipal Corporations.");
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === 'district') {
            setCities([]);
            setForm(prev => ({ ...prev, city: '' }));
            if (value) fetchCities(value);
        }
    };

    const handleAddMC = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/mcs", { ...form, name: form.fullName });
            if (res.data.success) {
                toast.success("Municipal Corporation added successfully!");
                resetForm();
                fetchMCs();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add MC record.");
        }
    };

    const handleUpdateMC = async (e) => {
        e.preventDefault();
        try {
            const res = await api.patch(`/mcs/${editingMc._id}`, { ...form, name: form.fullName });
            if (res.data.success) {
                toast.success("MC record updated successfully!");
                resetForm();
                fetchMCs();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update MC record.");
        }
    };

    const startEdit = (mc) => {
        setEditingMc(mc);
        setForm({
            fullName: mc.name || "",
            email: mc.email || "",
            password: "",
            district: mc.district || "",
            city: mc.city || "",
            zone: mc.zone || "",
            ward: mc.ward || ""
        });
        if (mc.district) fetchCities(mc.district);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingMc(null);
        setForm({ fullName: "", email: "", password: "", district: "", city: "", zone: "", ward: "" });
        setCities([]);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/mcs/${id}`);
            toast.success("MC record deleted.");
            fetchMCs();
        } catch (err) {
            toast.error("Failed to delete MC record.");
        }
    };

    const filteredMCs = (mcUsers || []).filter(mc => 
        Object.values(mc).some(val => 
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Manage Municipal Corporations</h2>
                <p className="text-muted">Assign MCs to specific registered operational areas.</p>
            </header>

            <div className="dashboard-card p-4 mb-4 shadow-sm border-0 bg-white">
                <h5 className="fw-bold mb-4">{editingMc ? "Edit MC Account" : "Register New MC"}</h5>
                <form onSubmit={editingMc ? handleUpdateMC : handleAddMC}>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Full Name</label>
                            <input className="form-control" name="fullName" placeholder="e.g. MC Dharamshala"
                                value={form.fullName} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Email Address</label>
                            <input className="form-control" name="email" type="email" placeholder="mc@example.com"
                                value={form.email} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Password {editingMc && "(Leave blank to keep current)"}</label>
                            <input className="form-control" name="password" type="password" placeholder="••••••••"
                                value={form.password} onChange={handleChange} required={!editingMc} />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label small fw-bold">District</label>
                            <select className="form-select" name="district" value={form.district} onChange={handleChange} required>
                                <option value="">Select District</option>
                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">City</label>
                            <select className="form-select" name="city" value={form.city} onChange={handleChange} required disabled={!form.district}>
                                <option value="">Select City</option>
                                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
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
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Ward No.</label>
                            <input className="form-control" name="ward" placeholder="e.g. Ward 5"
                                value={form.ward} onChange={handleChange} required />
                        </div>
                        <div className="col-12 text-end gap-2 d-flex justify-content-end mt-4">
                            {editingMc && (
                                <button className="btn btn-light px-4" type="button" onClick={resetForm}>Cancel</button>
                            )}
                            <button className="btn btn-primary px-4 fw-bold" type="submit">
                                {editingMc ? "Update MC account" : "Register MC account"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">MC Name</th>
                                <th>Assigned Jurisdiction</th>
                                <th>Ward</th>
                                <th>Status</th>
                                <th className="pe-4 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-5">Loading Municipal Corporations...</td></tr>
                            ) : filteredMCs.length === 0 ? (
                                <tr><td colSpan={5} className="text-center text-muted py-5">
                                    <i className="fas fa-search fa-2x mb-2 d-block opacity-25"></i>
                                    No matching results found.
                                </td></tr>
                            ) : (
                                filteredMCs.map((mc) => (
                                    <tr key={mc._id}>
                                        <td className="ps-4">
                                            <div className="fw-bold text-primary">{mc.name}</div>
                                            <small className="text-muted">{mc.email}</small>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <span className="fw-bold">{mc.district}</span>
                                                <span className="small text-muted">{mc.city} | {mc.zone || "Auto"}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="mb-0"><strong>Ward:</strong> {mc.ward || "N/A"}</p>
                                        </td>
                                        <td><span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">Active</span></td>
                                        <td className="pe-4 text-end">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(mc)}>
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(mc._id)}>
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
    );
};

export default Managemc;
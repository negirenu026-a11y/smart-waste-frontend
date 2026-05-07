import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { useSearch } from "../../../context/SearchContext";

const Managecitizens = () => {
    const { searchTerm, setSearchTerm } = useSearch();
    const [citizens, setCitizens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCitizen, setEditingCitizen] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        city: "",
        state: ""
    });

    useEffect(() => {
        fetchCitizens();
    }, []);

    const fetchCitizens = async () => {
        try {
            setLoading(true);
            const res = await api.get("/users");
            const allUsers = res.data.users || [];
            setCitizens(allUsers.filter(u => u.userType === "citizen"));
        } catch (err) {
            toast.error("Failed to fetch citizens.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this citizen account?")) return;
        try {
            await api.delete(`/users/${id}`);
            toast.success("Citizen removed.");
            fetchCitizens();
        } catch (err) {
            toast.error("Failed to remove citizen.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.patch(`/users/${editingCitizen._id}`, form);
            if (res.data.success) {
                toast.success("Citizen updated successfully!");
                setEditingCitizen(null);
                fetchCitizens();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update citizen.");
        }
    };

    const startEdit = (citizen) => {
        setEditingCitizen(citizen);
        setForm({
            name: citizen.name || "",
            email: citizen.email || "",
            phone: citizen.phone || "",
            password: "",
            city: citizen.city || "",
            state: citizen.state || ""
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredCitizens = citizens.filter(c => 
        Object.values(c).some(val => 
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold">Manage Citizens</h2>
                    <p className="text-muted">Overview of registered users and their details.</p>
                </div>
                {!editingCitizen && (
                    <div className="search-bar" style={{ width: '300px' }}>
                        <input
                            type="text"
                            className="form-control shadow-sm border-0"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
            </header>

            {editingCitizen && (
                <div className="dashboard-card p-4 mb-4 shadow-sm border-0 bg-white">
                    <h5 className="fw-bold mb-4">Edit Citizen Account</h5>
                    <form onSubmit={handleUpdate}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Full Name</label>
                                <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Email Address</label>
                                <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Phone</label>
                                <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">City</label>
                                <input className="form-control" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">State</label>
                                <input className="form-control" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">New Password (Optional)</label>
                                <input className="form-control" type="password" placeholder="Leave blank to keep same" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                            </div>
                            <div className="col-12 text-end d-flex gap-2 justify-content-end">
                                <button className="btn btn-light px-4" type="button" onClick={() => setEditingCitizen(null)}>Cancel</button>
                                <button className="btn btn-primary px-4" type="submit">Update Account</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Citizen</th>
                                <th>Contact</th>
                                <th>Regional Info</th>
                                <th>Registered</th>
                                <th className="pe-4 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-5">Loading citizens...</td></tr>
                            ) : filteredCitizens.length === 0 ? (
                                <tr><td colSpan={5} className="text-center text-muted py-5">
                                    <i className="fas fa-search fa-2x mb-2 d-block opacity-25"></i>
                                    No matching results found.
                                </td></tr>
                            ) : (
                                filteredCitizens.map((c) => (
                                    <tr key={c._id}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="avatar-xs bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, fontWeight: 'bold' }}>
                                                    {(c.name || "U")[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <span className="fw-bold d-block">{c.name}</span>
                                                    <small className="text-muted">{c.email}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{c.phone || "N/A"}</td>
                                        <td>
                                            <p className="mb-0"><strong>City:</strong> {c.city || 'N/A'}</p>
                                            <p className="mb-0"><strong>State:</strong> {c.state || 'N/A'}</p>
                                        </td>
                                        <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                        <td className="pe-4 text-end">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(c)}>
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}>
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

export default Managecitizens;
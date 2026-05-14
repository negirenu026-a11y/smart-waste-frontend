import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { resolveMediaUrl } from "../../../utils/mediaUrl";
import { useSearch } from "../../../context/SearchContext";

const ManageTasks = () => {
    const { searchTerm } = useSearch();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get("/tasks");
            setTasks(res.data.tasks);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            const res = await api.delete(`/tasks/${id}`);
            if (res.data.success) {
                const { toast } = await import('react-toastify');
                toast.success("Task deleted successfully.");
                fetchTasks();
            }
        } catch (err) {
            console.error("Delete task error:", err);
        }
    };

    const filteredTasks = (tasks || []).filter(task => 
        Object.values(task).some(val => 
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Global Task Oversight</h2>
                <p className="text-muted">Review all tasks across all zones and municipal corporations.</p>
            </header>

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Task Details</th>
                                <th>Assigned Worker</th>
                                <th>Deadline</th>
                                <th>Status</th>
                                <th>Evidence / Proof</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-5">Loading tasks Oversight...</td></tr>
                            ) : filteredTasks.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-5 text-muted">No matching results found.</td></tr>
                            ) : (
                                filteredTasks.map((task) => (
                                    <tr key={task._id}>
                                        <td className="ps-4">
                                            <p className="fw-bold mb-0">{task.title}</p>
                                            <span className="text-muted small">ID: #{task._id.substring(0, 8)}</span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <img src={resolveMediaUrl(task.workerPhoto) || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignedTo || "Worker")}`} alt="Worker" className="rounded-circle" style={{ width: '30px', height: '30px' }} />
                                                <span>{task.assignedTo || "Unassigned"}</span>
                                            </div>
                                        </td>
                                        <td>{task.deadline || "No deadline"}</td>
                                        <td>
                                            <span className={`badge ${task.status === 'Completed' || task.status === 'Resolved' ? 'bg-success' : task.status === 'In Progress' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td>
                                            {(task.completionProof || task.proofImage) ? (
                                                <div className="d-inline-block position-relative group" style={{ cursor: 'pointer' }} onClick={() => window.open(resolveMediaUrl(task.completionProof || task.proofImage))}>
                                                    <img src={resolveMediaUrl(task.completionProof || task.proofImage)} alt="Proof" className="rounded shadow-sm border" style={{ width: '60px', height: '40px', objectFit: 'cover' }} />
                                                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100 transition-all rounded">
                                                        <i className="fas fa-search-plus text-white"></i>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-muted italic small">No proof yet</span>
                                            )}
                                        </td>
                                        <td className="text-end pe-4">
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(task._id)} title="Delete Task">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
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

export default ManageTasks;
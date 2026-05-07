import { useNavigate } from "react-router-dom"

const Sidebar = () => {
    const navigate = useNavigate()
    return (
        <div className="bg-dark text-white p-3" style={{ width: "220px", minHeight: "100vh" }}>
            <h5 className="mb-4">Admin Panel</h5>

            <button className="btn btn-sm btn-light w-100 mb-2" onClick={() => navigate("/admin/manage-mc")}>Manage MC</button>
            <button className="btn btn-sm btn-light w-100 mb-2" onClick={() => navigate("/admin/manage-areas")}>Manage Areas</button>
            <button className="btn btn-sm btn-light w-100 mb-2" onClick={() => navigate("/admin/manage-citizens")}>Manage Citizens</button>
            <button className="btn btn-sm btn-light w-100 mb-2" onClick={() => navigate("/admin/manage-complaints")}>Manage Complaints</button>
            <button className="btn btn-sm btn-light w-100 mb-2" onClick={() => navigate("/admin/manage-tasks")}>Manage Tasks</button>
        </div>
    )
}
export default Sidebar 
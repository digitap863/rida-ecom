import { Outlet, Navigate } from "react-router-dom";

function AdminPrivateRoutes() {
    const adminToken = JSON.parse(localStorage.getItem("adminToken"))
    return adminToken ? <Outlet /> : <Navigate to="/login" />;
}

export default AdminPrivateRoutes;

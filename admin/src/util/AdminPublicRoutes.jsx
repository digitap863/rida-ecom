import { Navigate, Outlet } from "react-router-dom";

function AdminPublicRoutes() {
  
  const adminToken = JSON.parse(localStorage.getItem("adminToken"));

  return adminToken ? <Navigate to="/" /> : <Navigate to="/login" />;
}

export default AdminPublicRoutes;
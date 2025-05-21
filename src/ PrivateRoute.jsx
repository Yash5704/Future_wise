// src/PrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem("token"); // Check auth status
    const location = useLocation();

    return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;

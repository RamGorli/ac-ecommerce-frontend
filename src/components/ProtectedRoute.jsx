// components/ProtectedRoute.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const ProtectedRoute = ({ children, role: requiredRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      // support either decoded.role (string) or decoded.roles (array)
      const roles = decoded.roles || (decoded.role ? [decoded.role] : []);
      if (requiredRole && !roles.includes(requiredRole)) {
        // unauthorized — redirect to login or a 403 page
        navigate("/login");
      }
    } catch (err) {
      console.error("Token decode error:", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate, requiredRole]);

  return children;
};

export default ProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct syntax for newer versions

// Install it: npm install jwt-decode

const ProtectedRoute = () => {
    const token = localStorage.getItem("token");

    // Check if token exists and is valid
    if (token) {
        try {
            const decodedToken = jwtDecode(token);

            // Check if token is expired
            if (decodedToken.exp * 1000 < Date.now()) {
                localStorage.removeItem("token"); // Clear expired token
                return <Navigate to="/signin" />;
            }

            return <Outlet />;
        } catch (error) {
            console.error("Invalid token format:", error);
            localStorage.removeItem("token"); // Clear invalid token
            return <Navigate to="/signin" />;
        }
    }

    return <Navigate to="/signin" />;
};

export default ProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkAuth } from "../api/productApi";

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifyAuth = async () => {
            const authStatus = await checkAuth();
            setIsAuthenticated(authStatus);
        };
        verifyAuth();
    }, []);

    if (isAuthenticated === null) return <div>Loading...</div>;

    return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;

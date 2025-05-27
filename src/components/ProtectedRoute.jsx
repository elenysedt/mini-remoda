import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, isAdmin } = useAuth();

    console.log("ProtectedRoute: Usuario autenticado:", user);
    console.log("ProtectedRoute: Usuario es admin:", isAdmin);

    return user && isAdmin ? children : <Navigate to="/login" />;
};


export default ProtectedRoute;

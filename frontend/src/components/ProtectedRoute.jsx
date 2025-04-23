import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = ({ allowedRoles, children }) => {
	const { user, loading } = useAuth();

	if (loading) {
		return <Loader />;
	}

	console.log(user);
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (allowedRoles && !allowedRoles.includes(user.role)) {
		console.log("User role not allowed:", user.role);
		return <Navigate to="/" replace />;
	}

	console.log("User role:", user.role);

	return children;
};

export default ProtectedRoute;

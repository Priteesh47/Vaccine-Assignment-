import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../config/axios";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
	const [token, setToken] = useState(localStorage.getItem("token"));
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(!!token);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		if (token) {
			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			fetchUser();
		} else {
			delete api.defaults.headers.common["Authorization"];
			setLoading(false);
		}
	}, [token]);

	const fetchUser = async () => {
		try {
			const res = await api.get("/users/me");
			setUser(res.data.data);
			setIsAuthenticated(true);
		} catch (err) {
			console.error("Failed to fetch user:", err);
			logout();
		} finally {
			setLoading(false);
		}
	};

	const login = async (email, password) => {
		try {
			const res = await api.post("/users/login", { email, password });
			const { token } = res.data.data;
			setToken(token);
			localStorage.setItem("token", token);
			setIsAuthenticated(true);
			toast.success("Logged in successfully!");
			navigate("/");
		} catch (err) {
			toast.error("Login failed. Check your credentials.");
			throw err;
		}
	};

	const register = async (data) => {
		try {
			await api.post("/users/register", data);
			toast.success("Registration successful! Please log in.");
			navigate("/login");
		} catch (err) {
			toast.error("Registration failed.");
			throw err;
		}
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		setIsAuthenticated(false);
		localStorage.removeItem("token");
		delete api.defaults.headers.common["Authorization"];
		toast.info("Logged out.");
		navigate("/login");
	};

	return (
		<AuthContext.Provider
			value={{ user, isAuthenticated, register, login, logout, loading }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

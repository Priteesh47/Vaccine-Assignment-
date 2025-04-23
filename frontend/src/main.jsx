import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Toaster } from "sonner";
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<BrowserRouter
		future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
	>
		<AuthProvider>
			<Toaster position="bottom-right" />
			<App />
		</AuthProvider>
	</BrowserRouter>
);

import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
			<h1 className="text-6xl font-bold text-blue-700 mb-4">404</h1>
			<p className="text-xl text-gray-700 mb-2">Oops! Page not found.</p>
			<p className="text-gray-500 mb-6 text-center max-w-md">
				The page you are looking for doesn't exist or has been moved.
			</p>
			<button
				onClick={() => navigate("/")}
				className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
			>
				Go to Home
			</button>
		</div>
	);
};

export default NotFound;

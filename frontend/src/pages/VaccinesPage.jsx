import React, { useState, useEffect } from "react";
import api from "../config/axios";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const VaccinesPage = () => {
	const navigate = useNavigate();

	const [vaccines, setVaccines] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchVaccines = async () => {
			try {
				const response = await api.get("/vaccines");
				const data = response.data.data;

				setVaccines(data);
			} catch (err) {
				setError(err.message);
				console.error("Error fetching vaccines:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchVaccines();
	}, []);

	const extractFeatures = (description) => {
		return description
			.split(".")
			.map((item) => item.trim())
			.filter((item) => item.length > 0);
	};

	if (loading) {
		return <Loader />;
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-screen bg-slate-100">
				<div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
					<div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
						<svg
							className="w-8 h-8 text-red-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					</div>
					<h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
						Error Loading Vaccines
					</h2>
					<p className="text-gray-600 text-center">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="mt-6 w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-100 to-white">
			{/* Hero Section */}
			<div className="bg-[#0c0e1c] text-white ">
				<div className="max-w-6xl mx-auto px-4 py-16">
					<h1 className="text-4xl md:text-5xl font-bold">Available Vaccines</h1>
					<p className="mt-4 text-lg text-slate-300 max-w-2xl">
						At Vaccino, we provide access to high-quality, safe vaccines.
						Explore our comprehensive range and book your appointment today.
					</p>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-6xl mx-auto px-4 py-12">
				{vaccines.length === 0 ? (
					<div className="text-center py-12">
						<h2 className="text-2xl font-semibold text-gray-700">
							No vaccines available at the moment
						</h2>
						<p className="mt-2 text-gray-500">
							Please check back later for updates.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{vaccines.map((vaccine) => (
							<div
								key={vaccine.id}
								className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:shadow-xl border border-slate-200"
							>
								{/* Vaccine Image */}
								<div className="relative h-56 overflow-hidden">
									<img
										src={vaccine.image || "/api/placeholder/400/300"}
										alt={vaccine.name}
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-[#0c0e1c]/90 to-transparent"></div>
									<h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
										{vaccine.name}
									</h3>
								</div>

								{/* Vaccine Details */}
								<div className="p-6">
									<div className="mb-4 flex flex-wrap gap-2">
										<span className="inline-block px-3 py-1 text-sm font-semibold text-[#0c0e1c] bg-slate-100 rounded-full">
											{vaccine.age_group}
										</span>
										<span className="inline-block px-3 py-1 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
											Available
										</span>
									</div>

									<p className="text-gray-700 mb-4">{vaccine.description}</p>

									<div className="space-y-3">
										{/* Manufacturer */}
										<div className="flex items-center text-gray-700">
											<svg
												className="w-5 h-5 mr-2 text-[#0c0e1c]"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
												/>
											</svg>
											<span className="font-medium">
												{vaccine.manufacturer}
											</span>
										</div>

										{/* Dosage */}
										<div className="flex items-center text-gray-700">
											<svg
												className="w-5 h-5 mr-2 text-[#0c0e1c]"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
												/>
											</svg>
											<span className="font-medium">{vaccine.dosage}</span>
										</div>

										{/* Date Added */}
										{vaccine.created_at && (
											<div className="flex items-center text-gray-700">
												<svg
													className="w-5 h-5 mr-2 text-[#0c0e1c]"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												<span className="font-medium">
													Added:{" "}
													{new Date(vaccine.created_at).toLocaleDateString()}
												</span>
											</div>
										)}
									</div>

									{/* Features List */}
									{vaccine.description && vaccine.description.includes(".") && (
										<div className="mt-6">
											<h4 className="text-sm font-semibold text-gray-900 mb-2">
												Key Benefits:
											</h4>
											<ul className="list-disc list-inside space-y-1">
												{extractFeatures(vaccine.description).map(
													(feature, index) => (
														<li key={index} className="text-sm text-gray-600">
															{feature}
														</li>
													)
												)}
											</ul>
										</div>
									)}

									{/* Book Now Button */}
									<div className="mt-6">
										<button
											onClick={() => navigate("/book-appointment")}
											className="w-full bg-[#0c0e1c] text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition duration-300 flex items-center justify-center font-medium"
										>
											<span>Book Appointment</span>
											<svg
												className="w-5 h-5 ml-2"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M13 7l5 5m0 0l-5 5m5-5H6"
												/>
											</svg>
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Bottom CTA */}
			<div className="bg-slate-100 py-12">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
						Protect Your Health With Vaccino
					</h2>
					<p className="text-gray-600 max-w-2xl mx-auto mb-8">
						Our team of medical professionals is ready to help you stay
						protected. Schedule your vaccination appointment today.
					</p>
					<button
						onClick={() => navigate("/contact")}
						className="bg-[#0c0e1c] text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition duration-300 font-medium"
					>
						Contact Us
					</button>
				</div>
			</div>
		</div>
	);
};

export default VaccinesPage;

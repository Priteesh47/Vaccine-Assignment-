import React, { useState, useEffect } from "react";
import axios from "../config/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
	const navigate = useNavigate();
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("all");
	const [sortBy, setSortBy] = useState("date-desc");
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		fetchAppointments();
	}, []);

	const fetchAppointments = async () => {
		try {
			setLoading(true);
			const response = await axios.get("/appointments/me");
			setAppointments(response.data.data);
		} catch (error) {
			toast.error("Failed to fetch appointments");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleCancelAppointment = async (id) => {
		if (!window.confirm("Are you sure you want to cancel this appointment?"))
			return;

		try {
			await axios.patch(`/appointments/cancel-appointment/${id}`, {
				status: "cancelled"
			});
			toast.success("Appointment cancelled successfully");
			fetchAppointments();
		} catch (error) {
			toast.error("Failed to cancel appointment");
		}
	};

	const getStatusBadgeClasses = (status) => {
		switch (status.toLowerCase()) {
			case "completed":
				return "bg-green-100 text-green-800 border-green-200";
			case "scheduled":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "cancelled":
				return "bg-red-100 text-red-800 border-red-200";
			case "pending":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const formatDate = (dateString) => {
		const options = {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		};
		return new Date(dateString).toLocaleDateString("en-US", options);
	};

	const filteredAppointments = appointments
		.filter((appointment) => {
			if (filter === "all") return true;
			return appointment.status.toLowerCase() === filter;
		})
		.filter((appointment) => {
			if (!searchTerm) return true;
			return (
				appointment.vaccine.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				appointment.center.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "date-asc":
					return new Date(a.created_at) - new Date(b.created_at);
				case "date-desc":
					return new Date(b.created_at) - new Date(a.created_at);
				case "center":
					return a.center.name.localeCompare(b.center.name);
				case "vaccine":
					return a.vaccine.name.localeCompare(b.vaccine.name);
				default:
					return new Date(b.appointment_date) - new Date(a.appointment_date);
			}
		});

	const isPastAppointment = (dateString) => {
		return new Date(dateString) < new Date();
	};

	const EmptyState = () => (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-full">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-12 w-12"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			</div>
			<h3 className="text-lg font-bold text-gray-800">No appointments found</h3>
			<p className="text-gray-500 mt-2 max-w-sm">
				{filter !== "all"
					? `You don't have any ${filter} appointments.`
					: "You don't have any appointments scheduled. Book your vaccination appointment to get started."}
			</p>
			<button
				className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
				onClick={() => navigate("/book-appointment")}
			>
				Book New Appointment
			</button>
		</div>
	);

	const LoadingState = () => (
		<div className="space-y-4">
			{[1, 2, 3].map((item) => (
				<div key={item} className="border rounded-lg p-6 animate-pulse">
					<div className="flex items-center justify-between">
						<div className="space-y-2">
							<div className="h-4 bg-gray-200 rounded w-48"></div>
							<div className="h-3 bg-gray-200 rounded w-32"></div>
						</div>
						<div className="h-6 bg-gray-200 rounded w-24"></div>
					</div>
					<div className="mt-4 grid grid-cols-3 gap-4">
						<div className="h-12 bg-gray-200 rounded"></div>
						<div className="h-12 bg-gray-200 rounded"></div>
						<div className="h-12 bg-gray-200 rounded"></div>
					</div>
				</div>
			))}
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-5xl mx-auto">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">
							My Vaccination Appointments
						</h1>
						<p className="text-sm text-gray-600 mt-1">
							View and manage your vaccination appointments
						</p>
					</div>
					<button
						onClick={() => (window.location.href = "/book-appointment")}
						className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-2"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
								clipRule="evenodd"
							/>
						</svg>
						Book New Appointment
					</button>
				</div>

				<div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 mb-6">
					<div className="p-5 sm:flex sm:items-center sm:justify-between border-b border-gray-200 bg-gray-50">
						<div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 sm:mb-0">
							<div>
								<label
									htmlFor="filter"
									className="block text-xs font-medium text-gray-500 mb-1"
								>
									Status
								</label>
								<select
									id="filter"
									value={filter}
									onChange={(e) => setFilter(e.target.value)}
									className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 pl-3 pr-10"
								>
									<option value="all">All Appointments</option>
									<option value="scheduled">Scheduled</option>
									<option value="completed">Completed</option>
									<option value="cancelled">Cancelled</option>
									<option value="pending">Pending</option>
								</select>
							</div>
							<div>
								<label
									htmlFor="sort"
									className="block text-xs font-medium text-gray-500 mb-1"
								>
									Sort By
								</label>
								<select
									id="sort"
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 pl-3 pr-10"
								>
									<option value="date-desc">Date (Newest First)</option>
									<option value="date-asc">Date (Oldest First)</option>
									<option value="center">Vaccination Center</option>
									<option value="vaccine">Vaccine Type</option>
								</select>
							</div>
						</div>
						<div className="relative">
							<input
								type="text"
								placeholder="Search by vaccine or center..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10 py-2"
							/>
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 text-gray-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-white">
						{loading ? (
							<LoadingState />
						) : filteredAppointments.length === 0 ? (
							<EmptyState />
						) : (
							<ul className="divide-y divide-gray-200">
								{filteredAppointments.map((appointment) => (
									<li key={appointment.id} className="p-5 transition">
										<div className="flex flex-col sm:flex-row sm:items-center justify-between">
											<div className="mb-4 sm:mb-0">
												<div className="flex items-center">
													<h3 className="text-lg font-semibold text-gray-800">
														{appointment.vaccine.name}
													</h3>
													<span
														className={`ml-3 px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClasses(
															appointment.status
														)}`}
													>
														{appointment.status}
													</span>
												</div>
												<p className="text-sm text-gray-600 mt-1">
													Dose {appointment.dosage_number} •{" "}
													{formatDate(appointment.appointment_date)}
												</p>
											</div>

											{appointment.status === "scheduled" &&
												!isPastAppointment(appointment.appointment_date) && (
													<div className="flex flex-wrap gap-2">
														<button
															onClick={() =>
																handleCancelAppointment(appointment.id)
															}
															className="px-4 py-2 text-sm border border-red-500 text-red-600 rounded hover:bg-red-50 transition"
														>
															Cancel
														</button>
													</div>
												)}
										</div>

										<div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
											<div className="bg-gray-50 rounded p-3">
												<p className="text-xs font-medium text-gray-500 mb-1">
													Vaccination Center
												</p>
												<p className="text-sm text-gray-800">
													{appointment.center.name}
												</p>
											</div>
											<div className="bg-gray-50 rounded p-3">
												<p className="text-xs font-medium text-gray-500 mb-1">
													Appointment ID
												</p>
												<p className="text-sm text-gray-800">
													{appointment.id}
												</p>
											</div>
											<div className="bg-gray-50 rounded p-3">
												<p className="text-xs font-medium text-gray-500 mb-1">
													Booked On
												</p>
												<p className="text-sm text-gray-800">
													{new Date(
														appointment.created_at
													).toLocaleDateString()}
												</p>
											</div>
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MyAppointments;

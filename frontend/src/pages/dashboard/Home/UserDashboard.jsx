import React, { useEffect, useState } from "react";
import {
	FaCalendarCheck,
	FaSyringe,
	FaHospital,
	FaClock,
	FaCheckCircle,
	FaTimesCircle,
	FaCalendarAlt
} from "react-icons/fa";
import api from "../../../config/axios";
import Loader from "../../../components/Loader";
import { useAuth } from "../../../context/AuthContext";
import { format } from "date-fns";

const UserDashboard = () => {
	const { user } = useAuth();
	const [appointments, setAppointments] = useState([]);
	const [vaccines, setVaccines] = useState([]);
	const [centers, setCenters] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			setIsLoading(true);
			try {
				const [appointmentRes, vaccineRes, centerRes] = await Promise.all([
					api.get(`/appointments/me`),
					api.get("/vaccines"),
					api.get("/vaccine-center")
				]);

				setAppointments(appointmentRes.data.data || []);
				setVaccines(vaccineRes.data.data || []);
				setCenters(centerRes.data.data || []);
				setError(null);
			} catch (err) {
				console.error("Error fetching user dashboard data", err);
				setError("Failed to load your dashboard. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, [user.id]);

	const statusColors = {
		scheduled: "bg-blue-100 text-blue-700",
		completed: "bg-green-100 text-green-700",
		cancelled: "bg-yellow-100 text-yellow-700",
		rejected: "bg-red-100 text-red-700"
	};

	const statusIcons = {
		scheduled: <FaClock className="text-blue-500" />,
		completed: <FaCheckCircle className="text-green-500" />,
		cancelled: <FaTimesCircle className="text-yellow-500" />,
		rejected: <FaTimesCircle className="text-red-500" />
	};

	if (isLoading) return <Loader />;
	if (error)
		return (
			<div className="text-center text-red-600 font-medium p-4">{error}</div>
		);

	const sortedAppointments = [...appointments].sort(
		(a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)
	);

	return (
		<div className="p-6 space-y-8">
			<h1 className="text-2xl font-bold text-gray-800">
				Welcome, {user.name || "User"} 👋
			</h1>

			{/* Quick Info */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				<div className="p-4 bg-white rounded-lg shadow flex items-center justify-between">
					<div>
						<p className="text-sm text-gray-500">Vaccines Available</p>
						<h2 className="text-2xl font-bold text-blue-600">
							{vaccines.length}
						</h2>
					</div>
					<FaSyringe className="text-3xl text-blue-400" />
				</div>

				<div className="p-4 bg-white rounded-lg shadow flex items-center justify-between">
					<div>
						<p className="text-sm text-gray-500">Centers</p>
						<h2 className="text-2xl font-bold text-green-600">
							{centers.length}
						</h2>
					</div>
					<FaHospital className="text-3xl text-green-400" />
				</div>

				<div className="p-4 bg-white rounded-lg shadow flex items-center justify-between">
					<div>
						<p className="text-sm text-gray-500">Your Appointments</p>
						<h2 className="text-2xl font-bold text-rose-600">
							{appointments.length}
						</h2>
					</div>
					<FaCalendarCheck className="text-3xl text-rose-400" />
				</div>
			</div>

			{/* Appointment History */}
			<div className="bg-white p-6 rounded-lg shadow border border-gray-100">
				<h2 className="text-lg font-semibold mb-4 text-gray-800">
					Appointment History
				</h2>
				{appointments.length === 0 ? (
					<p className="text-gray-500">No appointment history available.</p>
				) : (
					<ul className="divide-y divide-gray-200 max-h-[40vh] overflow-y-auto pr-4">
						{sortedAppointments.map((appt) => (
							<li
								key={appt.id}
								className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
							>
								<div className="flex items-center gap-3">
									{statusIcons[appt.status] || (
										<FaCalendarAlt className="text-gray-400" />
									)}
									<div>
										<p className="text-sm font-medium text-gray-700">
											Dose {appt.dosage_number} - {appt.vaccine.name}
										</p>
										<p className="text-sm text-gray-500">
											{format(new Date(appt.appointment_date), "PPpp")} @{" "}
											{appt.center.name}
										</p>
									</div>
								</div>
								<span
									className={`text-xs font-semibold px-3 py-1 rounded-full ${
										statusColors[appt.status] || "bg-gray-100 text-gray-700"
									}`}
								>
									{appt.status}
								</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default UserDashboard;

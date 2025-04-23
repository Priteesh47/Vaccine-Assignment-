import React, { useEffect, useState } from "react";
import {
	FaSyringe,
	FaBoxes,
	FaUsers,
	FaHospital,
	FaCalendarCheck,
	FaChartLine,
	FaExclamationTriangle,
	FaStepBackward
} from "react-icons/fa";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from "recharts";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import Loader from "../../../components/Loader";
import { useAuth } from "../../../context/AuthContext";

const DashboardHome = () => {
	const navigate = useNavigate();
	const { user } = useAuth();

	const [stats, setStats] = useState({
		vaccines: 0,
		inventory: 0,
		users: 0,
		centers: 0,
		appointments: 0
	});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [appointmentData, setAppointmentData] = useState([]);

	useEffect(() => {
		const fetchStats = async () => {
			setIsLoading(true);
			try {
				const promises = [
					api.get("/vaccines"),
					api.get("/vaccine-inventory"),
					api.get("/vaccine-center"),
					api.get("/appointments")
				];

				// Only Admin can fetch users
				if (user.role === "Admin") {
					promises.push(api.get("/users"));
				}

				const responses = await Promise.all(promises);

				// Destructure responses with fallback for non-admins
				const [
					vaccineRes,
					inventoryRes,
					centerRes,
					appointmentRes,
					userRes = { data: { data: [] } }
				] = responses;

				// Update stats
				setStats({
					vaccines: vaccineRes.data.data.length,
					inventory: inventoryRes.data.data.length,
					users: userRes.data.data.length,
					centers: centerRes.data.data.length,
					appointments: appointmentRes.data.data.length
				});

				// Group appointments by date
				const rawAppointments = appointmentRes.data.data;
				const dateCounts = {};

				rawAppointments.forEach((appointment) => {
					const date = new Date(
						appointment.appointment_date
					).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric"
					});

					dateCounts[date] = (dateCounts[date] || 0) + 1;
				});

				const formattedData = Object.entries(dateCounts).map(
					([date, count]) => ({
						date,
						count
					})
				);

				formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));
				setAppointmentData(formattedData);
				setError(null);
			} catch (err) {
				console.error("Error fetching dashboard stats", err);
				setError("Failed to load dashboard data. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchStats();
	}, [user.role]);

	const cards = [
		{
			label: "Vaccines",
			value: stats.vaccines,
			icon: <FaSyringe />,
			textColor: "text-blue-800",
			iconColor: "text-blue-600"
		},
		{
			label: "Inventory",
			value: stats.inventory,
			icon: <FaBoxes />,
			textColor: "text-green-800",
			iconColor: "text-green-600"
		},
		{
			label: "Users",
			value: stats.users,
			icon: <FaUsers />,
			textColor: "text-purple-800",
			iconColor: "text-purple-600",
			show: user.role === "Admin"
		},
		{
			label: "Centers",
			value: stats.centers,
			icon: <FaHospital />,
			textColor: "text-amber-800",
			iconColor: "text-amber-600"
		},
		{
			label: "Appointments",
			value: stats.appointments,
			icon: <FaCalendarCheck />,
			textColor: "text-rose-800",
			iconColor: "text-rose-600"
		}
	];

	if (isLoading) {
		return <Loader />;
	}

	if (error) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-6 rounded-lg flex items-center gap-3 shadow-md max-w-2xl">
					<FaExclamationTriangle className="text-2xl text-red-500" />
					<span className="text-md font-medium">{error}</span>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-10">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<h1 className="text-3xl font-bold text-gray-800 flex items-center">
					Dashboard Overview
				</h1>
			</div>

			{/* Stat Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-6">
				{cards
					.filter((card) => card.show !== false) // Show all unless explicitly hidden
					.map((card) => (
						<div
							key={card.label}
							className={`flex items-center justify-between p-6 bg-white ${card.textColor} rounded-xl shadow-md hover:shadow-lg transition duration-200 transform hover:-translate-y-1`}
						>
							<div>
								<p className="text-xs uppercase tracking-wider font-bold opacity-80">
									{card.label}
								</p>
								<h2 className="text-3xl font-bold mt-1">{card.value}</h2>
							</div>
							<div className={`text-4xl ${card.iconColor}`}>{card.icon}</div>
						</div>
					))}
			</div>

			{/* Appointments Line Chart */}
			<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
				<h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center border-b pb-4">
					<FaChartLine className="mr-2 text-blue-600" />
					<span>Appointment Trends</span>
				</h2>
				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={appointmentData}
							margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
						>
							<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
							<XAxis
								dataKey="date"
								label={{ value: "Date", position: "insideBottom", offset: -10 }}
								tick={{ fill: "#6b7280" }}
							/>
							<YAxis
								label={{
									value: "Appointments",
									angle: -90,
									position: "insideLeft"
								}}
								tick={{ fill: "#6b7280" }}
							/>
							<Tooltip
								formatter={(value) => [`${value} appointments`, "Count"]}
								labelFormatter={(label) => `Date: ${label}`}
								contentStyle={{
									backgroundColor: "white",
									borderRadius: "8px",
									boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
									border: "1px solid #e5e7eb"
								}}
							/>
							<Legend verticalAlign="top" height={36} iconType="circle" />
							<Line
								name="Appointments"
								type="monotone"
								dataKey="count"
								stroke="#3b82f6"
								strokeWidth={3}
								activeDot={{
									r: 8,
									stroke: "#2563eb",
									strokeWidth: 2,
									fill: "#3b82f6"
								}}
								dot={{ stroke: "#3b82f6", strokeWidth: 2, r: 4, fill: "white" }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};

export default DashboardHome;

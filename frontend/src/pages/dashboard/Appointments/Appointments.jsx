import React, { useEffect, useState } from "react";
import { IoCheckmarkSharp } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { toast } from "sonner";
import Loader from "../../../components/Loader";
import api from "../../../config/axios";

const Appointments = () => {
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchAppointments = async () => {
		try {
			const res = await api.get("/appointments");
			// sorted by created_at in descending order
			const sortedAppointments = res.data.data.sort(
				(a, b) => new Date(b.created_at) - new Date(a.created_at)
			);
			setAppointments(sortedAppointments || []);
		} catch (err) {
			toast.error("Failed to load appointments");
		} finally {
			setLoading(false);
		}
	};

	const updateStatus = async (id, status) => {
		try {
			await api.patch(`/appointments/update-status/${id}`, { status });
			toast.success(`Appointment marked as ${status}`);
			fetchAppointments();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to update status");
		}
	};

	useEffect(() => {
		fetchAppointments();
	}, []);

	if (loading) return <Loader />;

	return (
		<div className="p-6 bg-gray-50">
			<div className="mx-auto">
				<h2 className="text-3xl font-bold text-gray-800 mb-8">Appointments</h2>

				{appointments.length === 0 ? (
					<div className="bg-white rounded-lg shadow-md p-8 text-center">
						<p className="text-gray-500 text-lg">No appointments found.</p>
					</div>
				) : (
					<div className="bg-white rounded-lg shadow-md overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead>
								<tr className="bg-gray-100">
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										User
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Vaccine
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Center
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Date
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Status
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{appointments.map((appt) => (
									<tr
										key={appt.id}
										className="hover:bg-gray-50 transition-colors"
									>
										<td className="px-6 py-4 text-sm font-medium text-gray-900">
											{appt.user?.name}
										</td>
										<td className="px-6 py-4 text-sm text-gray-700">
											{appt.vaccine?.name}
										</td>
										<td className="px-6 py-4 text-sm text-gray-700">
											{appt.center?.name}
										</td>
										<td className="px-6 py-4 text-sm text-gray-700">
											{new Date(appt.appointment_date).toLocaleDateString()}
										</td>
										<td className="px-6 py-4 text-sm">
											<span
												className={`px-3 py-1 inline-flex text-sm rounded-full font-medium
												${
													appt.status === "completed"
														? "bg-green-100 text-green-700"
														: appt.status === "cancelled" ||
														  appt.status === "rejected"
														? "bg-red-100 text-red-700"
														: "bg-yellow-100 text-yellow-700"
												}
											`}
											>
												{appt.status}
											</span>
										</td>
										<td className="px-6 py-4 text-sm">
											<div className="flex gap-3">
												<button
													disabled={appt.status !== "scheduled"}
													onClick={() => {
														const confirm = window.confirm(
															"Are you sure you want to mark this appointment as completed?"
														);
														if (confirm) updateStatus(appt.id, "completed");
													}}
													className={`px-4 py-2 text-sm rounded-md font-medium transition ${
														appt.status !== "scheduled"
															? "bg-gray-200 text-gray-500 cursor-not-allowed"
															: "bg-green-100 text-green-700 hover:bg-green-200"
													}`}
												>
													<IoCheckmarkSharp className="w-4 h-4" />
												</button>

												<button
													disabled={appt.status !== "scheduled"}
													onClick={() => {
														const confirm = window.confirm(
															"Are you sure you want to reject this appointment?"
														);
														if (confirm) updateStatus(appt.id, "rejected");
													}}
													className={`px-4 py-2 text-sm rounded-md font-medium transition ${
														appt.status !== "scheduled"
															? "bg-gray-200 text-gray-500 cursor-not-allowed"
															: "bg-red-100 text-red-700 hover:bg-red-200"
													}`}
												>
													<MdCancel className="w-4 h-4" />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default Appointments;

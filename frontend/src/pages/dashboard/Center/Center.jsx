import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import Loader from "../../../components/Loader";

const Centers = () => {
	const [centers, setCenters] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fetchCenters = async () => {
		try {
			const res = await api.get("/vaccine-center");
			const sortedCenters = res.data.data.sort(
				(a, b) => new Date(b.created_at) - new Date(a.created_at)
			);
			setCenters(sortedCenters || []);
		} catch (err) {
			toast.error("Failed to load vaccination centers");
		} finally {
			setLoading(false);
		}
	};

	const deleteCenter = async (id) => {
		if (
			!window.confirm(
				"Are you sure you want to delete this vaccination center?"
			)
		)
			return;

		try {
			await api.delete(`/vaccine-center/${id}`);
			toast.success("Vaccination center deleted successfully");
			fetchCenters();
		} catch (err) {
			toast.error(
				err?.response?.data?.message || "Failed to delete vaccination center"
			);
		}
	};

	useEffect(() => {
		fetchCenters();
	}, []);

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="p-6 ">
			<div className=" mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-3xl font-bold text-gray-800">
						Vaccination Centers
					</h2>
					<button
						onClick={() => navigate("/dashboard/centers/new")}
						className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all duration-200 flex items-center shadow-md"
					>
						<FaPlus className="w-5 h-5 mr-2" />
						Add Center
					</button>
				</div>

				{centers.length === 0 ? (
					<div className="bg-white rounded-lg shadow-md p-8 text-center">
						<p className="text-gray-500 text-lg">
							No vaccination centers found. Add your first center to get
							started.
						</p>
					</div>
				) : (
					<div className="bg-white rounded-lg shadow-md overflow-hidden">
						<table className="min-w-full divide-y divide-gray-200">
							<thead>
								<tr className="bg-gray-100">
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wider">
										Image
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wider">
										Name
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wider">
										Address
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wider">
										City
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wider">
										State
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wider">
										Phone
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{centers.map((center) => (
									<tr
										key={center.id}
										className="hover:bg-gray-50 transition-colors"
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<img
													src={center.image}
													alt={center.name}
													className="w-16 h-16 rounded-md object-cover border border-gray-200 shadow-sm"
													onError={(e) => {
														e.target.onerror = null;
														e.target.src =
															"https://via.placeholder.com/150?text=No+Image";
													}}
												/>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-gray-900">
												{center.name}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-700 truncate w-20">
												{center.address}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-700">{center.city}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-700">
												{center.state}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-700">
												{center.phone}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div className="flex space-x-3">
												<button
													onClick={() =>
														navigate(`/dashboard/centers/edit/${center.id}`)
													}
													className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
												>
													<FaEdit className="w-4 h-4 mr-1" />
													Edit
												</button>
												<button
													onClick={() => deleteCenter(center.id)}
													className="text-red-600 hover:text-red-800 flex items-center transition-colors"
												>
													<FaTrashAlt className="w-4 h-4 mr-1" />
													Delete
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

export default Centers;

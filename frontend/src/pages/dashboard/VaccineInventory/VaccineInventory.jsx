import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import Loader from "../../../components/Loader";

const VaccineInventory = () => {
	const [inventory, setInventory] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fetchInventory = async () => {
		try {
			const res = await api.get("/vaccine-inventory");
			const sortedInventory = res.data.data.sort(
				(a, b) => new Date(b.created_at) - new Date(a.created_at)
			);
			setInventory(sortedInventory || []);
		} catch (err) {
			toast.error("Failed to load inventory");
		} finally {
			setLoading(false);
		}
	};

	const deleteInventory = async (id) => {
		if (!window.confirm("Are you sure you want to delete this record?")) return;

		try {
			await api.delete(`/vaccine-inventory/${id}`);
			toast.success("Inventory deleted successfully");
			fetchInventory();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to delete");
		}
	};

	useEffect(() => {
		fetchInventory();
	}, []);

	if (loading) return <Loader />;

	return (
		<div className="p-6 bg-gray-50">
			<div className="mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-3xl font-bold text-gray-800">
						Vaccine Inventory
					</h2>
					<button
						onClick={() => navigate("/dashboard/inventory/new")}
						className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all duration-200 flex items-center shadow-md"
					>
						<FaPlus className="w-5 h-5 mr-2" />
						Add Inventory
					</button>
				</div>

				{inventory.length === 0 ? (
					<div className="bg-white rounded-lg shadow-md p-8 text-center">
						<p className="text-gray-500 text-lg">No inventory records found.</p>
					</div>
				) : (
					<div className="bg-white rounded-lg shadow-md overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead>
								<tr className="bg-gray-100">
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Vaccine
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Center
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Batch Number
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Quantity
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Expiry Date
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{inventory.map((item) => (
									<tr
										key={item.id}
										className="hover:bg-gray-50 transition-colors"
									>
										<td className="px-6 py-4 text-sm text-gray-900 font-medium">
											{item.vaccine?.name || `#${item.vaccine_id}`}
										</td>
										<td className="px-6 py-4 text-sm text-gray-700">
											{item.center.name}
										</td>
										<td className="px-6 py-4 text-sm text-gray-700">
											{item.batch_number}
										</td>
										<td className="px-6 py-4 text-sm text-gray-700">
											{item.quantity}
										</td>
										<td className="px-6 py-4 text-sm text-gray-700">
											{new Date(item.expiry_date).toLocaleDateString()}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div className="flex space-x-3">
												<button
													onClick={() =>
														navigate(`/dashboard/inventory/edit/${item.id}`)
													}
													className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
												>
													<FaEdit className="w-4 h-4 mr-1" />
													Edit
												</button>
												<button
													onClick={() => deleteInventory(item.id)}
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

export default VaccineInventory;

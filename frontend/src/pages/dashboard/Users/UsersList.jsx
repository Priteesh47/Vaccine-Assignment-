import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../config/axios";
import Loader from "../../../components/Loader";

const UsersList = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchUsers = async () => {
		try {
			const res = await api.get("/users");
			setUsers(res.data.data || []);
		} catch (err) {
			toast.error("Failed to load users");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	if (loading) return <Loader />;

	return (
		<div className="p-6">
			<div className="mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-3xl font-bold text-gray-800">Users</h2>
				</div>

				{users.length === 0 ? (
					<div className="bg-white rounded-lg shadow-md p-8 text-center">
						<p className="text-gray-500 text-lg">No users found.</p>
					</div>
				) : (
					<div className="bg-white rounded-lg shadow-md overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead>
								<tr className="bg-gray-100">
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Avatar
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Name
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Email
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Phone
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Gender
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Role
									</th>
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
										Address
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{users.map((user) => (
									<tr
										key={user.id}
										className="hover:bg-gray-50 transition-colors"
									>
										<td className="px-6 py-4">
											<img
												src={user.avatar}
												alt={user.name}
												className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
												onError={(e) => {
													e.target.onerror = null;
													e.target.src =
														"https://via.placeholder.com/100?text=No+Image";
												}}
											/>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm font-medium text-gray-900">
												{user.name}
											</div>
										</td>
										<td className="px-6 py-4 text-sm text-gray-700">
											{user.email}
										</td>
										<td className="px-6 py-4 text-sm text-gray-700">
											{user.phone}
										</td>
										<td className="px-6 py-4 text-sm text-gray-700">
											{user.gender}
										</td>
										<td className="px-6 py-4 text-sm">
											<span className="px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full bg-blue-100 text-blue-700">
												{user.role}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-gray-700">
											{user.address}
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

export default UsersList;

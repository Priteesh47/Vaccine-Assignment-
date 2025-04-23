import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
	FaSyringe,
	FaBoxes,
	FaUsers,
	FaHospital,
	FaCalendarCheck,
	FaHome,
	FaSignOutAlt,
	FaBars,
	FaChevronLeft,
	FaUserAltSlash,
	FaUserSecret
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const navItems = [
	{
		path: "/dashboard",
		label: "Home",
		icon: <FaHome />,
		roles: ["Admin", "Staff"]
	},
	{
		path: "/dashboard",
		label: "Dashboard",
		icon: <FaHome />,
		roles: ["User"]
	},
	{
		path: "/dashboard/my-appointments",
		label: "My Appointments",
		icon: <FaCalendarCheck />,
		roles: ["User"]
	},
	{
		path: "/dashboard/vaccines",
		label: "Vaccines",
		icon: <FaSyringe />,
		roles: ["Admin", "Staff"]
	},
	{
		path: "/dashboard/inventory",
		label: "Inventory",
		icon: <FaBoxes />,
		roles: ["Admin", "Staff"]
	},
	{
		path: "/dashboard/appointments",
		label: "Appointments",
		icon: <FaCalendarCheck />,
		roles: ["Admin", "Staff"]
	},
	{
		path: "/dashboard/centers",
		label: "Centers",
		icon: <FaHospital />,
		roles: ["Admin", "Staff"]
	},
	{
		path: "/dashboard/users",
		label: "Users",
		icon: <FaUsers />,
		roles: ["Admin"]
	},
	{
		path: "/dashboard/register-staff",
		label: "Register Staff",
		icon: <FaUserSecret />,
		roles: ["Admin"]
	}
];

const DashboardLayout = () => {
	const { pathname } = useLocation();
	const { user, logout: handleLogout } = useAuth();
	const [collapsed, setCollapsed] = useState(false);

	return (
		<div className="flex min-h-screen bg-gray-100">
			{/* Sidebar */}
			<aside
				className={`${
					collapsed ? "w-16" : "w-64"
				} bg-white shadow-lg border-r flex flex-col justify-between transition-all duration-300`}
			>
				<div>
					{/* Collapse Toggle Button */}
					<div className="flex items-center justify-between p-4 border-b">
						<div
							className={`font-bold text-xl text-[#0c0e1c] transition-all ${
								collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
							}`}
						>
							Vaccine Admin
						</div>
						<button
							onClick={() => setCollapsed(!collapsed)}
							className="text-slate-900 hover:text-black transition text-xl"
							title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
						>
							{collapsed ? <FaBars /> : <FaChevronLeft />}
						</button>
					</div>

					<nav className="p-4 space-y-2">
						{navItems
							.filter((item) => item.roles.includes(user.role))
							.map((item) => (
								<Link
									key={item.path}
									to={item.path}
									title={collapsed ? item.label : ""}
									className={`flex items-center ${
										collapsed ? "justify-center" : "gap-3"
									} px-4 py-2 rounded-md text-sm font-medium transition hover:bg-gray-100 ${
										pathname === item.path
											? "bg-gray-200 text-black"
											: "text-gray-700"
									}`}
								>
									<span className="text-lg text-slate-600">{item.icon}</span>
									<span
										className={`transition-all ${
											collapsed ? "hidden" : "inline"
										}`}
									>
										{item.label}
									</span>
								</Link>
							))}
					</nav>
				</div>

				{/* User Info */}
				<div className="p-4 border-t flex items-center justify-between">
					{!collapsed ? (
						<>
							<div className="flex items-center gap-3">
								<img
									src={user.avatar}
									alt={user.name}
									className="w-10 h-10 rounded-full object-cover border"
								/>
								<div className="text-sm font-medium text-gray-800">
									{user.name}
								</div>
							</div>
							<button
								onClick={handleLogout}
								className="text-gray-500 hover:text-red-600 transition"
								title="Logout"
							>
								<FaSignOutAlt className="w-5 h-5" />
							</button>
						</>
					) : (
						<button
							onClick={handleLogout}
							className="text-gray-500 hover:text-red-600 transition mx-auto"
							title="Logout"
						>
							<FaSignOutAlt className="w-5 h-5" />
						</button>
					)}
				</div>
			</aside>

			{/* Main Content */}
			<main className="flex-1 p-6 max-h-[100vh] overflow-y-auto bg-gray-50">
				<Outlet />
			</main>

			{/* Back to Landing page button on left bottom */}

			<div className="fixed bottom-4 right-4">
				<Link
					to="/"
					className="flex items-center gap-2 bg-purple-200 px-4 py-2 rounded-sm shadow-md hover:shadow-lg transition duration-200 hover:bg-purple-300"
				>
					<FaHome className="text-purple-600" />
					<span className="text-sm font-medium">Back to Home</span>
				</Link>
			</div>
		</div>
	);
};

export default DashboardLayout;

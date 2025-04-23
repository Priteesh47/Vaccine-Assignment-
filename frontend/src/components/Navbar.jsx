import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { user, logout, isAuthenticated } = useAuth();
	const [showMenu, setShowMenu] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const menuRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setShowMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [location.pathname]);

	const navLinks = [
		{ path: "/", label: "Home" },
		{ path: "/vaccines", label: "Vaccines" },
		{ path: "/centers", label: "Centers" },
		{ path: "/about", label: "About" },
		{ path: "/contact", label: "Contact" }
	];

	return (
		<header className="sticky top-0 z-50 bg-white/30 backdrop-blur-md border-b border-white/20 shadow-md">
			<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
				{/* Logo */}
				<div
					className="flex items-center gap-2 cursor-pointer"
					onClick={() => navigate("/")}
					aria-label="Go to homepage"
				>
					<span className="text-xl font-extrabold text-orange-500">
						Vaccino
					</span>
				</div>

				{/* Mobile Toggle */}
				<button
					className="md:hidden focus:outline-none"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
				>
					{isMobileMenuOpen ? (
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					) : (
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					)}
				</button>

				{/* Navigation Links */}
				<nav
					className={`${
						isMobileMenuOpen ? "flex" : "hidden"
					} md:flex flex-col md:flex-row md:items-center md:space-x-8 absolute md:static top-full left-0 w-full md:w-auto bg-gray-200 md:bg-transparent   z-40 shadow-md md:shadow-none transition-all duration-300`}
				>
					<ul className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 p-4 md:p-0 w-full md:w-auto">
						{navLinks.map((link) => (
							<NavLink
								key={link.path}
								to={link.path}
								className={({ isActive }) =>
									`text-base font-medium ${
										isActive
											? "text-orange-500"
											: "text-gray-700 hover:text-orange-500"
									}`
								}
							>
								{link.label}
							</NavLink>
						))}
					</ul>

					{/* Auth Buttons */}
					<div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 px-4 md:px-0 pb-4 md:pb-0 w-full md:w-auto">
						{!isAuthenticated ? (
							<>
								<button
									onClick={() => navigate("/register")}
									className="text-indigo-700 hover:text-orange-500 text-base w-full text-left md:w-auto"
								>
									Register
								</button>
								<button
									onClick={() => navigate("/login")}
									className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full transition w-full md:w-auto"
								>
									Login
								</button>
							</>
						) : (
							<div ref={menuRef} className="relative w-auto ">
								<div
									onClick={() => setShowMenu(!showMenu)}
									className="flex items-center justify-between cursor-pointer gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition w-full md:w-auto"
								>
									<img
										src={user?.avatar || assets.profile}
										alt="User"
										className="w-8 h-8 rounded-full border-2 border-indigo-300 object-cover"
									/>
									<span className="text-sm font-semibold">
										{user?.name || "User"}
									</span>
								</div>

								{showMenu && (
									<div className="absolute left-0 md:right-0 mt-2 bg-white shadow-lg rounded-lg text-sm w-48 z-50 border border-gray-100">
										<div className="px-4 py-3 border-b border-gray-100">
											<p className="font-semibold text-indigo-700">
												{user?.name || "User"}
											</p>
											<p className="text-xs text-gray-500">
												{user?.email || ""}
											</p>
										</div>
										<ul className="py-2">
											<li
												className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
												onClick={() => {
													setShowMenu(false);
													navigate("/profile");
												}}
											>
												My Profile
											</li>
											{user.role === "User" && (
												<>
													<li
														className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
														onClick={() => {
															setShowMenu(false);
															navigate("/book-appointment");
														}}
													>
														Book Appointment
													</li>
												</>
											)}
											<li
												className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
												onClick={() => {
													setShowMenu(false);
													navigate("/dashboard");
												}}
											>
												Dashboard
											</li>
										</ul>
										<div className="border-t border-gray-100">
											<p
												className="px-4 py-2 text-red-500 hover:text-red-600 cursor-pointer"
												onClick={logout}
											>
												Logout
											</p>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				</nav>
			</div>
		</header>
	);
};

export default Navbar;

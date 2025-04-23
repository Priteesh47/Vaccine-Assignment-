import React from "react";

import backgroundImage from "../assets/background.jpg";

const Header = () => {
	return (
		<div
			className="relative min-h-[62vh] mb-4 bg-cover bg-center flex items-center w-full overflow-hidden"
			style={{
				backgroundImage: `url("https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`
			}}
		>
			{/* Black Overlay */}
			<div className="absolute inset-0 bg-black bg-opacity-50"></div>

			{/* Content */}
			<div className="relative z-10 max-w-6xl text-center mx-auto py-12 px-6 md:px-20 lg:px-32 text-white">
				<h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight pt-20 mb-6">
					Get Yourself and Others Vaccinated
				</h2>
				<p className="text-lg sm:text-xl mb-8">
					Register for your vaccination today and protect yourself and others.
					Easily find nearby centers and book an appointment in minutes. Don't
					wait—your health and safety are just a click away!
				</p>

				<div className="space-x-4 mt-8">
					<a
						href="#speciality"
						className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300"
					>
						Book an Appointment
					</a>
				</div>
			</div>
		</div>
	);
};

export default Header;

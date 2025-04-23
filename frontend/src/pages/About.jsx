import React from "react";

const About = () => {
	const features = [
		{
			title: "Smart Appointment Booking",
			description:
				"Easily book vaccination appointments at centers near you with our intelligent scheduling system.",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			)
		},
		{
			title: "Vaccination History",
			description:
				"Track your complete vaccination history and upcoming appointments in one secure place.",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
					/>
				</svg>
			)
		},
		{
			title: "Geolocation Services",
			description:
				"Find vaccination centers near your location with real-time mapping and directions.",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
			)
		},
		{
			title: "Role-Based Access",
			description:
				"Custom experiences for patients, healthcare providers, and administrators.",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
					/>
				</svg>
			)
		}
	];

	return (
		<div className="bg-white font-sans">
			{/* Hero Section */}
			<section className="relative overflow-hidden h-[60vh]">
				{/* Image with Overlay */}
				<div className="absolute inset-0">
					<img
						src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						alt="Vaccino Healthcare"
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900 to-transparent"></div>
				</div>

				{/* Content on Overlay */}
				<div className="relative z-10 flex items-center justify-center h-full px-6 md:px-16">
					<div className="max-w-xl text-center text-white">
						<h1 className="text-4xl md:text-5xl font-bold mb-6">
							Welcome to Vaccino
						</h1>
						<p className="text-lg leading-relaxed">
							Vaccino is a comprehensive vaccine registration system designed to
							simplify the vaccination process for both individuals and
							healthcare providers. With our user-friendly platform, you can
							easily register, book appointments, and find nearby vaccination
							centers using real-time geolocation features.
						</p>
					</div>
				</div>
			</section>
			{/* Mission Statement */}
			<section className="py-16 bg-blue-50">
				<div className="container mx-auto px-6 max-w-4xl text-center">
					<h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
					<p className="text-lg text-gray-700 leading-relaxed">
						Vaccino is dedicated to making vaccines accessible to everyone
						through a user-friendly digital platform. We strive to simplify the
						vaccination process, reduce administrative burdens on healthcare
						providers, and ensure that communities are protected against
						preventable diseases.
					</p>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-6">
					<h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
						Powerful Features
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 max-w-6xl mx-auto">
						{features.map((feature, index) => (
							<div key={index} className="flex space-x-4">
								<div className="flex-shrink-0 mt-1">
									<div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600">
										{feature.icon}
									</div>
								</div>
								<div>
									<h3 className="text-xl font-semibold text-gray-800 mb-2">
										{feature.title}
									</h3>
									<p className="text-gray-600">{feature.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default About;

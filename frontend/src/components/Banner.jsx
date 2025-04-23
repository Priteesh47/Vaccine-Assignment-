import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Banner = () => {
	const navigate = useNavigate();

	return (
		<section className="bg-gradient-to-r from-gray-100 via-white to-gray-200">
			<div className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 mt-12">
				<div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/10 flex flex-col-reverse md:flex-row items-center justify-between overflow-hidden">
					{/* Text Content */}
					<div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 text-center md:text-left">
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
							Book Your Appointments
						</h1>
						<p className="mt-4 text-gray-700 text-base sm:text-lg">
							Your one-stop online platform for scheduling vaccinations easily,
							securely, and quickly.
						</p>
						<button
							onClick={() => {
								navigate("/login");
								window.scrollTo(0, 0);
							}}
							className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full mt-6 text-lg font-semibold transition-all duration-300"
						>
							Create Account
						</button>
					</div>

					{/* Image */}
					<div className="w-full md:w-1/2 flex justify-center items-center relative p-6 md:p-10">
						<img
							src="https://imgs.search.brave.com/DOJ0vvvQH-oNr19gPf1n6ol4I7ixBNBusdb8zwL8adA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nbWFydC5jb20v/ZmlsZXMvMjEvRmVt/YWxlLURvY3Rvci1Q/TkctUGljdHVyZS5w/bmc"
							alt="Appointment"
							className="w-full max-w-xs sm:max-w-sm lg:max-w-md object-contain"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Banner;

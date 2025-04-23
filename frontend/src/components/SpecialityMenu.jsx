import React, { useEffect, useState } from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";
import api from "../config/axios";

const SpecialityMenu = () => {
	const [vaccinesData, setVaccinesData] = useState();

	const fetchVaccines = async () => {
		try {
			const response = await api.get("/vaccines");
			const data = response.data.data;
			setVaccinesData(data);
		} catch (error) {
			console.error("Error fetching vaccines:", error);
		}
	};

	useEffect(() => {
		fetchVaccines();
	}, []);

	return (
		<div
			className="bg-gray-50 py-12 px-6 md:px-16 lg:px-24 text-center"
			id="speciality"
		>
			{/* Heading */}
			<h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6">
				Explore by Speciality
			</h1>
			<p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
				Find vaccines tailored to specific diseases and protect yourself with
				ease. From flu to COVID-19, find the right vaccine, check availability,
				and book your appointment in just a few clicks.
			</p>

			{/* Speciality Cards */}
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8  gap-6 max-w-5xl mx-auto">
				{vaccinesData?.map((item, index) => (
					<Link
						key={index}
						to={`/vaccines/${item?.id}`}
						onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
						className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center hover:shadow-lg transition-all duration-300"
					>
						<img
							src={item?.image}
							alt={item?.description}
							className="w-16 h-16 object-cover rounded-full mb-2"
						/>
						<p className="text-gray-700 text-sm font-medium">{item?.name}</p>
					</Link>
				))}
			</div>
		</div>
	);
};

export default SpecialityMenu;

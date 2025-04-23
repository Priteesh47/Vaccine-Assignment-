// import React, { useEffect, useState } from "react";
// import api from "../config/axios";
// import { toast } from "sonner";
// import Loader from "../components/Loader";
// import { useNavigate } from "react-router-dom";

// const BookAppointment = () => {
// 	const navigate = useNavigate();
// 	const [vaccines, setVaccines] = useState([]);
// 	const [centers, setCenters] = useState([]);
// 	const [formData, setFormData] = useState({
// 		vaccine_id: "",
// 		center_id: "",
// 		dosage_number: 1,
// 		appointment_date: ""
// 	});
// 	const [loading, setLoading] = useState(true);
// 	const [submitting, setSubmitting] = useState(false);

// 	useEffect(() => {
// 		const fetchOptions = async () => {
// 			try {
// 				const [vaccineRes, centerRes] = await Promise.all([
// 					api.get("/vaccines"),
// 					api.get("/vaccine-center")
// 				]);
// 				setVaccines(vaccineRes.data.data || []);
// 				setCenters(centerRes.data.data || []);
// 			} catch (err) {
// 				toast.error(err.response?.data?.message || "Failed to load options");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};
// 		fetchOptions();
// 	}, []);

// 	const handleChange = (e) => {
// 		const { name, value } = e.target;
// 		setFormData((prev) => ({
// 			...prev,
// 			[name]: name === "dosage_number" ? parseInt(value) : value
// 		}));
// 	};

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		setSubmitting(true);
// 		try {
// 			await api.post("/appointments", formData);
// 			toast.success("Appointment booked successfully");
// 			navigate("/dashboard");
// 		} catch (err) {
// 			toast.error(err?.response?.data?.message || "Failed to book appointment");
// 		} finally {
// 			setSubmitting(false);
// 		}
// 	};

// 	if (loading) return <Loader />;

// 	return (
// 		<div className="py-10 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
// 			<div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-8">
// 				<div className="mb-6">
// 					<h1 className="text-2xl font-bold text-gray-800">Book Appointment</h1>
// 					<p className="text-sm text-gray-500">
// 						Choose vaccine, center, and date to schedule
// 					</p>
// 				</div>

// 				<form onSubmit={handleSubmit} className="space-y-6">
// 					{/* Vaccine Select */}
// 					<div>
// 						<label className="block text-sm font-medium text-gray-700 mb-1">
// 							Vaccine
// 						</label>
// 						<select
// 							name="vaccine_id"
// 							value={formData.vaccine_id}
// 							onChange={handleChange}
// 							required
// 							className="w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
// 						>
// 							<option value="">Select a vaccine</option>
// 							{vaccines.map((v) => (
// 								<option key={v.id} value={v.id}>
// 									{v.name} – {v.manufacturer} ({v.age_group})
// 								</option>
// 							))}
// 						</select>
// 					</div>

// 					{/* Center Select */}
// 					<div>
// 						<label className="block text-sm font-medium text-gray-700 mb-1">
// 							Vaccination Center
// 						</label>
// 						<select
// 							name="center_id"
// 							value={formData.center_id}
// 							onChange={handleChange}
// 							required
// 							className="w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
// 						>
// 							<option value="">Select a center</option>
// 							{centers.map((c) => (
// 								<option key={c.id} value={c.id}>
// 									{c.name} – {c.city}, {c.state}
// 								</option>
// 							))}
// 						</select>
// 					</div>

// 					{/* Dosage Number */}
// 					<div>
// 						<label className="block text-sm font-medium text-gray-700 mb-1">
// 							Dosage Number
// 						</label>
// 						<input
// 							type="number"
// 							name="dosage_number"
// 							value={formData.dosage_number}
// 							onChange={handleChange}
// 							min={1}
// 							required
// 							className="w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
// 						/>
// 					</div>

// 					{/* Appointment Date */}
// 					<div>
// 						<label className="block text-sm font-medium text-gray-700 mb-1">
// 							Appointment Date
// 						</label>
// 						<input
// 							type="date"
// 							name="appointment_date"
// 							value={formData.appointment_date}
// 							onChange={handleChange}
// 							required
// 							className="w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
// 						/>
// 					</div>

// 					{/* Submit */}
// 					<div className="text-right">
// 						<button
// 							type="submit"
// 							disabled={submitting}
// 							className={`px-6 py-2 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition ${
// 								submitting ? "opacity-70 cursor-not-allowed" : ""
// 							}`}
// 						>
// 							{submitting ? "Booking..." : "Book Appointment"}
// 						</button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };

// export default BookAppointment;


import React, { useEffect, useState } from "react";
import api from "../config/axios";
import { toast } from "sonner";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const BookAppointment = () => {
	const navigate = useNavigate();
	const [vaccines, setVaccines] = useState([]);
	const [centers, setCenters] = useState([]);
	const [selectedVaccine, setSelectedVaccine] = useState(null);
	const [selectedCenter, setSelectedCenter] = useState(null);
	const [formData, setFormData] = useState({
		vaccine_id: "",
		center_id: "",
		dosage_number: 1,
		appointment_date: ""
	});
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [step, setStep] = useState(1);

	// Get tomorrow's date as minimum date for appointment
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	const minDate = tomorrow.toISOString().split("T")[0];

	const fetchOptions = async () => {
		try {
			const [vaccineRes, centerRes] = await Promise.all([
				api.get("/vaccines"),
				api.get("/vaccine-center")
			]);
			setVaccines(vaccineRes.data.data || []);
			setCenters(centerRes.data.data || []);
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to load options");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOptions();
	}, []);

	useEffect(() => {
		if (formData.vaccine_id) {
			const vaccine = vaccines.find(
				(v) => v.id === parseInt(formData.vaccine_id)
			);
			setSelectedVaccine(vaccine);
		}
	}, [formData.vaccine_id, vaccines]);

	useEffect(() => {
		if (formData.center_id) {
			const center = centers.find((c) => c.id === parseInt(formData.center_id));
			setSelectedCenter(center);
		}
	}, [formData.center_id, centers]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "dosage_number" ? parseInt(value) : value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			await api.post("/appointments", formData);
			toast.success("Appointment booked successfully");
			navigate("/dashboard");
			setFormData({
				vaccine_id: "",
				center_id: "",
				dosage_number: 1,
				appointment_date: ""
			});
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to book appointment");
		} finally {
			setSubmitting(false);
		}
	};

	const nextStep = () => {
		if (step === 1 && !formData.vaccine_id) {
			toast.error("Please select a vaccine to continue");
			return;
		}
		if (step === 2 && !formData.center_id) {
			toast.error("Please select a vaccination center to continue");
			return;
		}
		setStep(step + 1);
	};

	const prevStep = () => {
		setStep(step - 1);
	};

	if (loading) return <Loader />;

	return (
		<div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-3xl font-bold text-gray-800">
						Book Your Vaccination
					</h1>
					<p className="text-gray-600 mt-2">
						Complete the steps below to schedule your appointment
					</p>
				</div>

				{/* Progress Bar */}
				<div className="mb-12">
					<div className="flex justify-between items-center">
						{[
							"Select Vaccine",
							"Choose Center",
							"Schedule Appointment",
							"Confirm"
						].map((label, idx) => (
							<div key={idx} className="relative flex flex-col items-center">
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center ${
										step > idx + 1
											? "bg-green-500"
											: step === idx + 1
											? "bg-blue-600"
											: "bg-gray-300"
									} text-white font-semibold`}
								>
									{step > idx + 1 ? (
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
												d="M5 13l4 4L19 7"
											/>
										</svg>
									) : (
										idx + 1
									)}
								</div>
								<p
									className={`text-sm mt-2 ${
										step === idx + 1
											? "text-blue-600 font-medium"
											: "text-gray-500"
									}`}
								>
									{label}
								</p>
							</div>
						))}
					</div>
					<div className="relative mt-4">
						<div className="absolute top-0 h-1 w-full bg-gray-200 rounded"></div>
						<div
							className="absolute top-0 h-1 bg-blue-600 rounded transition-all duration-300"
							style={{ width: `${((step - 1) / 3) * 100}%` }}
						></div>
					</div>
				</div>

				<div className="bg-white shadow-lg rounded-xl overflow-hidden">
					{/* Step 1: Select Vaccine */}
					{step === 1 && (
						<div className="p-6">
							<h2 className="text-xl font-semibold text-gray-800 mb-6">
								Select Your Vaccine
							</h2>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
								{vaccines.map((vaccine) => (
									<div
										key={vaccine.id}
										onClick={() =>
											setFormData((prev) => ({
												...prev,
												vaccine_id: vaccine.id.toString()
											}))
										}
										className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
											formData.vaccine_id === vaccine.id.toString()
												? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
												: "border-gray-200 hover:bg-gray-50"
										}`}
									>
										<div className="flex items-center space-x-4">
											<div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
												<img
													src={vaccine.image}
													alt={vaccine.name}
													className="h-full w-full object-cover"
													onError={(e) => {
														e.target.onerror = null;
														e.target.src =
															"https://via.placeholder.com/150?text=Vaccine";
													}}
												/>
											</div>
											<div className="flex-1">
												<h3 className="text-lg font-medium text-gray-900">
													{vaccine.name}
												</h3>
												<p className="text-sm text-gray-500">
													{vaccine.manufacturer}
												</p>
											</div>
											{formData.vaccine_id === vaccine.id.toString() && (
												<div className="flex-shrink-0">
													<svg
														className="w-6 h-6 text-blue-600"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fillRule="evenodd"
															d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
															clipRule="evenodd"
														/>
													</svg>
												</div>
											)}
										</div>

										{formData.vaccine_id === vaccine.id.toString() && (
											<div className="mt-4 pt-4 border-t border-gray-200">
												<div className="grid grid-cols-2 gap-4 text-sm">
													<div>
														<span className="block text-gray-500">
															Age Group
														</span>
														<span className="font-medium">
															{vaccine.age_group}
														</span>
													</div>
													<div>
														<span className="block text-gray-500">Dosage</span>
														<span className="font-medium">
															{vaccine.dosage}
														</span>
													</div>
												</div>
												<p className="mt-2 text-sm text-gray-600">
													{vaccine.description}
												</p>
											</div>
										)}
									</div>
								))}
							</div>

							<div className="mt-8 flex justify-end">
								<button
									type="button"
									onClick={nextStep}
									className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
								>
									Continue
								</button>
							</div>
						</div>
					)}

					{/* Step 2: Select Center */}
					{step === 2 && (
						<div className="p-6">
							<h2 className="text-xl font-semibold text-gray-800 mb-6">
								Choose Vaccination Center
							</h2>

							<div className="grid grid-cols-1 gap-4">
								{centers.map((center) => (
									<div
										key={center.id}
										onClick={() =>
											setFormData((prev) => ({
												...prev,
												center_id: center.id.toString()
											}))
										}
										className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
											formData.center_id === center.id.toString()
												? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
												: "border-gray-200 hover:bg-gray-50"
										}`}
									>
										<div className="flex items-center">
											<div className="flex-shrink-0 h-20 w-20 bg-gray-100 rounded-md overflow-hidden">
												<img
													src={center.image}
													alt={center.name}
													className="h-full w-full object-cover"
													onError={(e) => {
														e.target.onerror = null;
														e.target.src =
															"https://via.placeholder.com/150?text=Center";
													}}
												/>
											</div>
											<div className="ml-4 flex-1">
												<h3 className="text-lg font-medium text-gray-900">
													{center.name}
												</h3>
												<div className="mt-1 flex items-center text-sm text-gray-500">
													<svg
														className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
														/>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
														/>
													</svg>
													<span>
														{center.address}, {center.city}, {center.state}
													</span>
												</div>
												<div className="mt-1 flex items-center text-sm text-gray-500">
													<svg
														className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
														/>
													</svg>
													<span>{center.phone}</span>
												</div>
											</div>
											{formData.center_id === center.id.toString() && (
												<div className="flex-shrink-0">
													<svg
														className="w-6 h-6 text-blue-600"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fillRule="evenodd"
															d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
															clipRule="evenodd"
														/>
													</svg>
												</div>
											)}
										</div>
									</div>
								))}
							</div>

							<div className="mt-8 flex justify-between">
								<button
									type="button"
									onClick={prevStep}
									className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
								>
									Back
								</button>
								<button
									type="button"
									onClick={nextStep}
									className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
								>
									Continue
								</button>
							</div>
						</div>
					)}

					{/* Step 3: Schedule Appointment */}
					{step === 3 && (
						<div className="p-6">
							<h2 className="text-xl font-semibold text-gray-800 mb-6">
								Schedule Your Appointment
							</h2>

							<div className="space-y-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Dosage Number
									</label>
									<div className="mt-1 flex rounded-md shadow-sm">
										<button
											type="button"
											onClick={() =>
												setFormData((prev) => ({
													...prev,
													dosage_number: Math.max(1, prev.dosage_number - 1)
												}))
											}
											className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
										>
											<svg
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
										<input
											type="number"
											name="dosage_number"
											value={formData.dosage_number}
											onChange={handleChange}
											min={1}
											required
											className="flex-1 min-w-0 block w-24 px-3 py-2 text-center border-y border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
										/>
										<button
											type="button"
											onClick={() =>
												setFormData((prev) => ({
													...prev,
													dosage_number: prev.dosage_number + 1
												}))
											}
											className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
										>
											<svg
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
									</div>
									{selectedVaccine && (
										<p className="mt-2 text-sm text-gray-500">
											Recommended: {selectedVaccine.dosage}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Appointment Date
									</label>
									<input
										type="date"
										name="appointment_date"
										value={formData.appointment_date}
										onChange={handleChange}
										min={minDate}
										required
										className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
									/>
									<p className="mt-2 text-sm text-gray-500">
										Select a date starting from tomorrow
									</p>
								</div>
							</div>

							<div className="mt-8 flex justify-between">
								<button
									type="button"
									onClick={prevStep}
									className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
								>
									Back
								</button>
								<button
									type="button"
									onClick={nextStep}
									className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
								>
									Review & Confirm
								</button>
							</div>
						</div>
					)}

					{/* Step 4: Confirm */}
					{step === 4 && (
						<div className="p-6">
							<h2 className="text-xl font-semibold text-gray-800 mb-6">
								Review and Confirm
							</h2>

							<div className="bg-gray-50 rounded-lg p-6 mb-6">
								<div className="space-y-4">
									<div className="flex justify-between">
										<span className="text-gray-500">Vaccine</span>
										<span className="font-medium">{selectedVaccine?.name}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Manufacturer</span>
										<span className="font-medium">
											{selectedVaccine?.manufacturer}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Vaccination Center</span>
										<span className="font-medium">{selectedCenter?.name}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Center Address</span>
										<span className="font-medium text-right">
											{selectedCenter?.address}, {selectedCenter?.city}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Dosage Number</span>
										<span className="font-medium">
											{formData.dosage_number}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Appointment Date</span>
										<span className="font-medium">
											{new Date(formData.appointment_date).toLocaleDateString(
												"en-US",
												{
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric"
												}
											)}
										</span>
									</div>
								</div>
							</div>

							<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
								<div className="flex">
									<div className="flex-shrink-0">
										<svg
											className="h-5 w-5 text-yellow-400"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div className="ml-3">
										<p className="text-sm text-yellow-700">
											Please arrive 15 minutes before your scheduled
											appointment. Don't forget to bring a valid ID with you.
										</p>
									</div>
								</div>
							</div>

							<form onSubmit={handleSubmit}>
								<div className="mt-6 flex justify-between">
									<button
										type="button"
										onClick={prevStep}
										className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
									>
										Back
									</button>
									<button
										type="submit"
										disabled={submitting}
										className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
									>
										{submitting ? (
											<span className="flex items-center">
												<svg
													className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
												Confirming...
											</span>
										) : (
											"Confirm Appointment"
										)}
									</button>
								</div>
							</form>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default BookAppointment;
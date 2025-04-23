import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import debounce from "lodash.debounce";
import api from "../../../config/axios";

const CenterSchema = Yup.object().shape({
	name: Yup.string().required("Name is required"),
	address: Yup.string().required("Address is required"),
	city: Yup.string().required("City is required"),
	state: Yup.string().required("State is required"),
	phone: Yup.string().required("Phone number is required"),
	latitude: Yup.number()
		.required("Latitude is required")
		.min(-90, "Latitude must be between -90 and 90")
		.max(90, "Latitude must be between -90 and 90"),
	longitude: Yup.number()
		.required("Longitude is required")
		.min(-180, "Longitude must be between -180 and 180")
		.max(180, "Longitude must be between -180 and 180")
});

const CreateEditCenterForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEdit = Boolean(id);

	const [initialValues, setInitialValues] = useState({
		name: "",
		address: "",
		city: "",
		state: "",
		phone: "",
		image: null,
		latitude: "",
		longitude: ""
	});

	const [imagePreview, setImagePreview] = useState(null);
	const [loading, setLoading] = useState(isEdit);
	const [locationOptions, setLocationOptions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);

	useEffect(() => {
		if (isEdit) {
			api
				.get(`vaccine-center/${id}`)
				.then((res) => {
					const center = res.data.data;
					setInitialValues({
						name: center.name,
						address: center.address,
						city: center.city,
						state: center.state,
						phone: center.phone,
						image: null,
						latitude: center.latitude || "",
						longitude: center.longitude || ""
					});
					setImagePreview(center.image);
				})
				.catch((error) => {
					toast.error(
						error.response?.data?.message || "Failed to load center data"
					);
				})
				.finally(() => setLoading(false));
		}
	}, [id, isEdit]);

	const fetchSuggestions = debounce(async (query) => {
		if (!query) {
			setLocationOptions([]);
			return;
		}
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
					query
				)}`
			);
			const data = await res.json();
			setLocationOptions(data);
			setShowSuggestions(true);
		} catch (err) {
			console.error("Geocode error", err);
			setLocationOptions([]);
		}
	}, 300);

	const handleSubmit = async (values, { setSubmitting }) => {
		const formData = new FormData();
		for (let key in values) {
			if (values[key] !== null && values[key] !== "") {
				formData.append(key, values[key]);
			}
		}

		try {
			if (isEdit) {
				await api.put(`vaccine-center/${id}`, formData, {
					headers: { "Content-Type": "multipart/form-data" }
				});
				toast.success("Vaccination center updated");
			} else {
				await api.post("vaccine-center", formData, {
					headers: { "Content-Type": "multipart/form-data" }
				});
				toast.success("Vaccination center created");
			}
			navigate("/dashboard/centers");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to save center");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#0c0e1c]" />
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl shadow-lg p-8 my-8">
			<h2 className="text-3xl font-bold mb-4">
				{isEdit ? "Edit Vaccination Center" : "Create Vaccination Center"}
			</h2>

			<Formik
				enableReinitialize
				initialValues={initialValues}
				validationSchema={CenterSchema}
				onSubmit={handleSubmit}
			>
				{({ setFieldValue, values, isSubmitting }) => (
					<Form className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Name */}
							<div>
								<label>Name</label>
								<Field name="name" className="input" />
								<ErrorMessage
									name="name"
									component="div"
									className="text-red-500"
								/>
							</div>

							{/* Phone */}
							<div>
								<label>Phone</label>
								<Field name="phone" className="input" />
								<ErrorMessage
									name="phone"
									component="div"
									className="text-red-500"
								/>
							</div>
						</div>

						{/* Address + Suggestions */}
						<div className="relative">
							<label>Address</label>
							<Field
								name="address"
								className="input"
								onChange={(e) => {
									const val = e.target.value;
									setFieldValue("address", val);
									fetchSuggestions(val);
								}}
								onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
								placeholder="Type to search address"
							/>
							<ErrorMessage
								name="address"
								component="div"
								className="text-red-500"
							/>
							{showSuggestions && locationOptions.length > 0 && (
								<ul className="absolute z-10 w-full bg-white border mt-1 max-h-60 overflow-y-auto rounded shadow-md">
									{locationOptions.map((opt, idx) => (
										<li
											key={idx}
											className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
											onClick={() => {
												setFieldValue("address", opt.display_name);
												setFieldValue("latitude", parseFloat(opt.lat));
												setFieldValue("longitude", parseFloat(opt.lon));
												setShowSuggestions(false);
												setLocationOptions([]);
												toast.success("Location selected");
											}}
										>
											{opt.display_name}
										</li>
									))}
								</ul>
							)}
						</div>

						{/* City & State */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label>City</label>
								<Field name="city" className="input" />
								<ErrorMessage
									name="city"
									component="div"
									className="text-red-500"
								/>
							</div>
							<div>
								<label>State</label>
								<Field name="state" className="input" />
								<ErrorMessage
									name="state"
									component="div"
									className="text-red-500"
								/>
							</div>
						</div>

						{/* Image Upload */}
						<div>
							<label>Center Image</label>
							<div className="flex gap-4">
								<div className="flex-1">
									<input
										type="file"
										accept="image/*"
										id="imageUpload"
										className="hidden"
										onChange={(e) => {
											if (e.target.files?.[0]) {
												setFieldValue("image", e.target.files[0]);
												setImagePreview(URL.createObjectURL(e.target.files[0]));
											}
										}}
									/>
									<label
										htmlFor="imageUpload"
										className="block cursor-pointer border border-dashed px-6 py-6 text-center rounded-md"
									>
										{imagePreview ? "Change Image" : "Upload Image"}
									</label>
								</div>
								{imagePreview && (
									<div className="w-32 h-32 rounded overflow-hidden border">
										<img
											src={imagePreview}
											alt="preview"
											className="w-full h-full object-cover"
										/>
									</div>
								)}
							</div>
						</div>

						{/* Buttons */}
						<div className="flex justify-end gap-4">
							<button
								type="button"
								onClick={() => navigate("/dashboard/centers")}
								className="px-4 py-2 border rounded"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="px-6 py-2 bg-black text-white rounded"
							>
								{isEdit ? "Update Center" : "Create Center"}
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default CreateEditCenterForm;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import api from "../../../config/axios";

const VaccineSchema = Yup.object().shape({
	name: Yup.string().required("Name is required"),
	manufacturer: Yup.string().required("Manufacturer is required"),
	description: Yup.string().required("Description is required"),
	dosage: Yup.string().required("Dosage is required"),
	age_group: Yup.string().required("Age group is required")
});

const CreateEditVaccineForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEdit = Boolean(id);
	const [initialValues, setInitialValues] = useState({
		name: "",
		manufacturer: "",
		description: "",
		dosage: "",
		age_group: "",
		image: null
	});
	const [imagePreview, setImagePreview] = useState(null);
	const [loading, setLoading] = useState(isEdit);

	useEffect(() => {
		if (isEdit) {
			setLoading(true);
			api
				.get(`vaccines/${id}`)
				.then((res) => {
					const v = res.data.data;
					setInitialValues({
						name: v.name,
						manufacturer: v.manufacturer,
						description: v.description,
						dosage: v.dosage,
						age_group: v.age_group,
						image: null
					});
					setImagePreview(v.image);
				})
				.catch(() => {
					toast.error("Failed to load vaccine data");
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [id, isEdit]);

	const handleSubmit = async (values, { setSubmitting }) => {
		const formData = new FormData();
		for (let key in values) {
			if (values[key]) {
				formData.append(key, values[key]);
			}
		}

		try {
			if (isEdit) {
				await api.put(`vaccines/update-vaccine/${id}`, formData, {
					headers: { "Content-Type": "multipart/form-data" }
				});
				toast.success("Vaccine updated successfully");
			} else {
				await api.post("vaccines/register-vaccine", formData, {
					headers: { "Content-Type": "multipart/form-data" }
				});
				toast.success("Vaccine created successfully");
			}
			navigate("/dashboard/vaccines");
		} catch (error) {
			toast.error(error.response.data.message || "Failed to save vaccine");
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
			<div className="mb-8">
				<h2 className="text-3xl font-bold text-[#0c0e1c]">
					{isEdit ? "Edit Vaccine" : "Create Vaccine"}
				</h2>
				<p className="text-gray-600 mt-2">
					{isEdit
						? "Update the vaccine information below"
						: "Fill in the details to add a new vaccine to the system"}
				</p>
			</div>

			<Formik
				enableReinitialize
				initialValues={initialValues}
				validationSchema={VaccineSchema}
				onSubmit={handleSubmit}
			>
				{({ setFieldValue, isSubmitting, errors, touched }) => (
					<Form className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Name Field */}
							<div>
								<label className="block text-gray-700 font-medium mb-2">
									Vaccine Name
								</label>
								<Field
									name="name"
									className={`w-full px-4 py-3 rounded-lg border ${
										errors.name && touched.name
											? "border-red-500"
											: "border-gray-300"
									} focus:border-[#0c0e1c] focus:ring-2 focus:ring-[#0c0e1c]/20 transition duration-200`}
									placeholder="Enter vaccine name"
								/>
								<ErrorMessage
									name="name"
									component="div"
									className="text-red-500 text-sm mt-1"
								/>
							</div>

							{/* Manufacturer Field */}
							<div>
								<label className="block text-gray-700 font-medium mb-2">
									Manufacturer
								</label>
								<Field
									name="manufacturer"
									className={`w-full px-4 py-3 rounded-lg border ${
										errors.manufacturer && touched.manufacturer
											? "border-red-500"
											: "border-gray-300"
									} focus:border-[#0c0e1c] focus:ring-2 focus:ring-[#0c0e1c]/20 transition duration-200`}
									placeholder="Enter manufacturer"
								/>
								<ErrorMessage
									name="manufacturer"
									component="div"
									className="text-red-500 text-sm mt-1"
								/>
							</div>
						</div>

						{/* Description Field */}
						<div>
							<label className="block text-gray-700 font-medium mb-2">
								Description
							</label>
							<Field
								as="textarea"
								name="description"
								className={`w-full px-4 py-3 rounded-lg border ${
									errors.description && touched.description
										? "border-red-500"
										: "border-gray-300"
								} focus:border-[#0c0e1c] focus:ring-2 focus:ring-[#0c0e1c]/20 transition duration-200`}
								rows={4}
								placeholder="Enter vaccine description and key benefits"
							/>
							<ErrorMessage
								name="description"
								component="div"
								className="text-red-500 text-sm mt-1"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Dosage Field */}
							<div>
								<label className="block text-gray-700 font-medium mb-2">
									Dosage Information
								</label>
								<Field
									name="dosage"
									className={`w-full px-4 py-3 rounded-lg border ${
										errors.dosage && touched.dosage
											? "border-red-500"
											: "border-gray-300"
									} focus:border-[#0c0e1c] focus:ring-2 focus:ring-[#0c0e1c]/20 transition duration-200`}
									placeholder="e.g. Two doses, 28 days apart"
								/>
								<ErrorMessage
									name="dosage"
									component="div"
									className="text-red-500 text-sm mt-1"
								/>
							</div>

							{/* Age Group Field */}
							<div>
								<label className="block text-gray-700 font-medium mb-2">
									Age Group
								</label>
								<Field
									name="age_group"
									className={`w-full px-4 py-3 rounded-lg border ${
										errors.age_group && touched.age_group
											? "border-red-500"
											: "border-gray-300"
									} focus:border-[#0c0e1c] focus:ring-2 focus:ring-[#0c0e1c]/20 transition duration-200`}
									placeholder="e.g. 18-60"
								/>
								<ErrorMessage
									name="age_group"
									component="div"
									className="text-red-500 text-sm mt-1"
								/>
							</div>
						</div>

						{/* Image Upload Field */}
						<div>
							<label className="block text-gray-700 font-medium mb-2">
								Vaccine Image
							</label>
							<div className="flex flex-col md:flex-row items-start gap-4">
								<div className="flex-1 w-full">
									<div className="border border-dashed border-gray-300 rounded-lg px-6 py-8 text-center cursor-pointer hover:border-[#0c0e1c] transition duration-200">
										<input
											type="file"
											accept="image/*"
											id="imageUpload"
											className="hidden"
											onChange={(e) => {
												if (e.target.files?.[0]) {
													setFieldValue("image", e.target.files[0]);
													setImagePreview(
														URL.createObjectURL(e.target.files[0])
													);
												}
											}}
										/>
										<label htmlFor="imageUpload" className="cursor-pointer">
											<div className="flex flex-col items-center">
												<svg
													className="w-10 h-10 text-gray-400 mb-3"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												<p className="text-gray-600 font-medium">
													{imagePreview ? "Change Image" : "Upload Image"}
												</p>
												<p className="text-gray-500 text-sm mt-1">
													Select a high-quality image (JPG, PNG)
												</p>
											</div>
										</label>
									</div>
								</div>
								{imagePreview && (
									<div className="flex-shrink-0">
										<div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
											<img
												src={imagePreview}
												alt="Preview"
												className="w-full h-full object-cover"
											/>
											<button
												type="button"
												className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
												onClick={() => {
													setImagePreview(null);
													setFieldValue("image", null);
												}}
											>
												<svg
													className="w-4 h-4 text-gray-600"
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
											</button>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center justify-between pt-4 border-t border-gray-200">
							<button
								type="button"
								onClick={() => navigate("/dashboard/vaccines")}
								className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="px-6 py-3 bg-[#0c0e1c] text-white font-medium rounded-lg hover:bg-gray-800 transition duration-200 flex items-center"
							>
								{isSubmitting && (
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
								)}
								{isEdit ? "Update Vaccine" : "Create Vaccine"}
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default CreateEditVaccineForm;

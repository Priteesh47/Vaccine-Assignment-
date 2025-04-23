import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import api from "../../../config/axios";

const VaccineInventorySchema = Yup.object().shape({
	vaccine_id: Yup.number().required("Vaccine is required"),
	center_id: Yup.number().required("Center is required"),
	quantity: Yup.number().required("Quantity is required").min(1, "Min 1 dose"),
	expiry_date: Yup.date().required("Expiry date is required"),
	batch_number: Yup.number().required("Batch number is required")
});

const CreateOrEditVaccineInventoryForm = () => {
	const { id } = useParams();
	const isEdit = Boolean(id);
	const navigate = useNavigate();

	const [initialValues, setInitialValues] = useState({
		vaccine_id: "",
		center_id: "",
		quantity: "",
		expiry_date: "",
		batch_number: ""
	});
	const [vaccines, setVaccines] = useState([]);
	const [centers, setCenters] = useState([]);
	const [loading, setLoading] = useState(isEdit);

	// Fetch vaccines and centers
	useEffect(() => {
		api
			.get("/vaccines")
			.then((res) => setVaccines(res.data.data || []))
			.catch(() => toast.error("Failed to load vaccines"));

		api
			.get("/vaccine-center")
			.then((res) => setCenters(res.data.data || []))
			.catch(() => toast.error("Failed to load centers"));
	}, []);

	// Fetch existing inventory data if editing
	useEffect(() => {
		if (isEdit) {
			setLoading(true);
			api
				.get(`/vaccine-inventory/${id}`)
				.then((res) => {
					const data = res.data.data;
					setInitialValues({
						vaccine_id: data.vaccine?.id || data.vaccine_id,
						center_id: data.center?.id || data.center_id,
						quantity: data.quantity,
						expiry_date: data.expiry_date ? data.expiry_date.split("T")[0] : "", // Optional fallback
						batch_number: data.batch_number
					});
				})
				.catch((error) =>
					toast.error(error.response.data.message || "Failed to load inventory")
				)
				.finally(() => setLoading(false));
		}
	}, [id, isEdit]);

	const handleSubmit = async (values, { setSubmitting }) => {
		try {
			if (isEdit) {
				await api.put(`/vaccine-inventory/${id}`, values);
				toast.success("Inventory updated successfully");
			} else {
				await api.post("/vaccine-inventory", values);
				toast.success("Inventory created successfully");
			}
			navigate("/dashboard/inventory");
		} catch (err) {
			toast.error(err.response?.data?.message || "Submission failed");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin h-12 w-12 rounded-full border-t-4 border-b-4 border-[#0c0e1c]" />
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl shadow-lg p-8 my-8">
			<div className="mb-8">
				<h2 className="text-3xl font-bold text-[#0c0e1c]">
					{isEdit ? "Edit Vaccine Inventory" : "Add Vaccine Inventory"}
				</h2>
				<p className="text-gray-600 mt-2">
					{isEdit
						? "Update inventory details below"
						: "Fill in the details to add a new vaccine inventory record"}
				</p>
			</div>

			<Formik
				initialValues={initialValues}
				validationSchema={VaccineInventorySchema}
				onSubmit={handleSubmit}
				enableReinitialize
			>
				{({ isSubmitting }) => (
					<Form className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Vaccine Select */}
							<div>
								<label className="block text-gray-700 font-medium mb-2">
									Vaccine
								</label>
								<Field
									as="select"
									name="vaccine_id"
									className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0c0e1c] focus:ring-2 focus:ring-[#0c0e1c]/20"
								>
									<option value="">Select Vaccine</option>
									{vaccines.map((vaccine) => (
										<option key={vaccine.id} value={vaccine.id}>
											{vaccine.name}
										</option>
									))}
								</Field>
								<ErrorMessage
									name="vaccine_id"
									component="div"
									className="text-red-500 text-sm mt-1"
								/>
							</div>

							{/* Center Select */}
							<div>
								<label className="block text-gray-700 font-medium mb-2">
									Vaccination Center
								</label>
								<Field
									as="select"
									name="center_id"
									className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0c0e1c] focus:ring-2 focus:ring-[#0c0e1c]/20"
								>
									<option value="">Select Center</option>
									{centers.map((center) => (
										<option key={center.id} value={center.id}>
											{center.name}
										</option>
									))}
								</Field>
								<ErrorMessage
									name="center_id"
									component="div"
									className="text-red-500 text-sm mt-1"
								/>
							</div>
						</div>

						{/* Quantity */}
						<div>
							<label className="block text-gray-700 font-medium mb-2">
								Quantity
							</label>
							<Field
								type="number"
								name="quantity"
								placeholder="Enter quantity"
								className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0c0e1c] focus:ring-2 focus:ring-[#0c0e1c]/20"
							/>
							<ErrorMessage
								name="quantity"
								component="div"
								className="text-red-500 text-sm mt-1"
							/>
						</div>

						{/* Expiry Date */}
						<div>
							<label className="block text-gray-700 font-medium mb-2">
								Expiry Date
							</label>
							<Field
								type="date"
								name="expiry_date"
								className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0c0e1c] focus:ring-2 focus:ring-[#0c0e1c]/20"
							/>
							<ErrorMessage
								name="expiry_date"
								component="div"
								className="text-red-500 text-sm mt-1"
							/>
						</div>

						{/* Batch Number */}
						<div>
							<label className="block text-gray-700 font-medium mb-2">
								Batch Number
							</label>
							<Field
								type="number"
								name="batch_number"
								placeholder="Enter batch number"
								className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0c0e1c] focus:ring-2 focus:ring-[#0c0e1c]/20"
							/>
							<ErrorMessage
								name="batch_number"
								component="div"
								className="text-red-500 text-sm mt-1"
							/>
						</div>

						{/* Buttons */}
						<div className="flex justify-between pt-4 border-t border-gray-200">
							<button
								type="button"
								onClick={() => navigate("/dashboard/inventory")}
								className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="px-6 py-3 bg-[#0c0e1c] text-white font-medium rounded-lg hover:bg-gray-800 flex items-center"
							>
								{isSubmitting && (
									<svg
										className="animate-spin mr-2 h-4 w-4"
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
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
										></path>
									</svg>
								)}
								{isEdit ? "Update Inventory" : "Create Inventory"}
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default CreateOrEditVaccineInventoryForm;

import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../../config/axios";

const RegisterStaff = () => {
	const navigate = useNavigate();

	const initialValues = {
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		dob: "",
		gender: "",
		address: "",
		phone: "",
		avatar: ""
	};

	const validationSchema = Yup.object().shape({
		name: Yup.string().required("Full name is required"),
		email: Yup.string().email("Invalid email").required("Email is required"),
		password: Yup.string()
			.min(6, "Min 6 characters")
			.required("Password is required"),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref("password")], "Passwords must match")
			.required("Confirm your password"),
		dob: Yup.date().required("Date of birth is required"),
		gender: Yup.string().required("Gender is required"),
		address: Yup.string().required("Address is required"),
		phone: Yup.string().required("Phone is required"),
		avatar: Yup.mixed()
	});

	const handleSubmit = async (values, { setSubmitting, resetForm }) => {
		const formData = new FormData();
		for (const key in values) {
			formData.append(key, values[key]);
		}

		try {
			await api.post("/users/register-staff", formData, {
				headers: { "Content-Type": "multipart/form-data" }
			});
			toast.success("Staff registered successfully!");
			resetForm();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Registration failed");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="flex flex-col md:flex-row  justify-center items-center">
			<div className="w-full flex items-center justify-center px-6 py-12">
				<div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-2xl">
					<h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
						Register Staff
					</h2>

					<Formik
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={handleSubmit}
					>
						{({ isSubmitting, setFieldValue }) => (
							<Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Field
									type="text"
									name="name"
									placeholder="Full Name"
									className="input-style"
								/>
								<ErrorMessage
									name="name"
									component="div"
									className="text-red-500 text-sm col-span-full"
								/>

								<Field
									type="email"
									name="email"
									placeholder="Email Address"
									className="input-style"
								/>
								<ErrorMessage
									name="email"
									component="div"
									className="text-red-500 text-sm col-span-full"
								/>

								<Field
									type="password"
									name="password"
									placeholder="Password"
									className="input-style"
								/>
								<Field
									type="password"
									name="confirmPassword"
									placeholder="Confirm Password"
									className="input-style"
								/>
								<ErrorMessage
									name="password"
									component="div"
									className="text-red-500 text-sm col-span-full"
								/>
								<ErrorMessage
									name="confirmPassword"
									component="div"
									className="text-red-500 text-sm col-span-full"
								/>

								<Field type="date" name="dob" className="input-style" />
								<ErrorMessage
									name="dob"
									component="div"
									className="text-red-500 text-sm col-span-full"
								/>

								<Field as="select" name="gender" className="input-style">
									<option value="">Select Gender</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</Field>
								<ErrorMessage
									name="gender"
									component="div"
									className="text-red-500 text-sm col-span-full"
								/>

								<Field
									type="text"
									name="address"
									placeholder="Address"
									className="input-style"
								/>
								<Field
									type="tel"
									name="phone"
									placeholder="Phone Number"
									className="input-style"
								/>
								<ErrorMessage
									name="address"
									component="div"
									className="text-red-500 text-sm col-span-full"
								/>
								<ErrorMessage
									name="phone"
									component="div"
									className="text-red-500 text-sm col-span-full"
								/>

								{/* File Upload */}
								<div className="col-span-full">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Avatar (optional)
									</label>
									<input
										type="file"
										name="avatar"
										accept="image/*"
										onChange={(e) =>
											setFieldValue("avatar", e.currentTarget.files[0])
										}
										className="block w-full border border-gray-300 rounded-lg px-3 py-2"
									/>
								</div>

								<button
									type="submit"
									disabled={isSubmitting}
									className="col-span-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
								>
									{isSubmitting ? "Registering..." : "Register Staff"}
								</button>
							</Form>
						)}
					</Formik>
				</div>
			</div>
		</div>
	);
};

export default RegisterStaff;

import { useFormik } from "formik";
import React, { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import axios from "../config/axios";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
	const { user } = useAuth();
	const [isEdit, setIsEdit] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState(null);

	const handleSetEdit = () => {
		setIsEdit((prev) => !prev);
		if (!isEdit) {
			setAvatarPreview(user?.avatar);
		}
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			name: user?.name || "",
			dob: user?.dob?.split("T")[0] || "",
			gender: user?.gender || "",
			address: user?.address || "",
			phone: user?.phone || "",
			avatar: null
		},
		validationSchema: Yup.object({
			name: Yup.string().required("Name is required"),
			dob: Yup.string().required("Date of Birth is required"),
			gender: Yup.string().required("Gender is required"),
			address: Yup.string().required("Address is required"),
			phone: Yup.string()
				.matches(/^\+?[0-9]{7,15}$/, "Invalid phone number")
				.required("Phone number is required")
		}),
		onSubmit: async (values, { setSubmitting }) => {
			try {
				const formData = new FormData();
				Object.entries(values).forEach(([key, val]) => {
					if (val) formData.append(key, val);
				});

				const res = await axios.patch(`/users/${user.id}`, formData, {
					headers: { "Content-Type": "multipart/form-data" }
				});

				toast.success("Profile updated successfully");
				setIsEdit(false);
			} catch (err) {
				toast.error(err.response?.data?.message || "Failed to update profile");
			} finally {
				setSubmitting(false);
			}
		}
	});

	const handleAvatarChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			formik.setFieldValue("avatar", file);
			const reader = new FileReader();
			reader.onloadend = () => setAvatarPreview(reader.result);
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="  py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
				<div className="md:flex">
					<div className="md:w-1/3 bg-gradient-to-b from-blue-600 to-indigo-700 text-white p-8">
						<div className="flex flex-col items-center text-center">
							<div className="relative group">
								<div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
									<img
										src={
											avatarPreview ||
											user?.avatar ||
											"https://via.placeholder.com/150"
										}
										alt="Profile"
										className="w-full h-full object-cover"
									/>
								</div>
								{isEdit && (
									<div className="absolute inset-0 flex items-center justify-center">
										<label className="w-full h-full cursor-pointer flex items-center justify-center">
											<input
												type="file"
												accept="image/*"
												onChange={handleAvatarChange}
												className="hidden"
											/>
											<div className="bg-black bg-opacity-50 rounded-full w-full h-full flex items-center justify-center">
												<span className="text-white text-sm font-medium">
													Change Photo
												</span>
											</div>
										</label>
									</div>
								)}
							</div>
							<h2 className="mt-6 text-2xl font-bold">{user.name}</h2>

							<p className=" text-blue-100 text-sm">
								Member since {new Date(user.created_at).toLocaleDateString()}
							</p>
							{!isEdit && (
								<button
									type="button"
									onClick={handleSetEdit}
									className="mt-8 px-8 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition font-medium shadow-sm"
								>
									Edit Profile
								</button>
							)}
						</div>
					</div>

					<div className="p-8 md:w-2/3">
						<h3 className="text-xl font-bold text-gray-800 mb-6">
							{isEdit ? "Edit Your Profile" : "Profile Information"}
						</h3>

						<form className="space-y-6" onSubmit={formik.handleSubmit}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{renderField("Full Name", "name", formik, isEdit)}
								{renderField("Phone Number", "phone", formik, isEdit)}
								{renderSelect(
									"Gender",
									"gender",
									["Male", "Female", "Other"],
									formik,
									isEdit
								)}
								{renderField("Date of Birth", "dob", formik, isEdit, "date")}
								<div className="md:col-span-2">
									{renderField("Address", "address", formik, isEdit)}
								</div>
							</div>

							{isEdit && (
								<div className="flex justify-end space-x-4 mt-8">
									<button
										type="button"
										onClick={handleSetEdit}
										className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={formik.isSubmitting}
										className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center"
									>
										{formik.isSubmitting && (
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
										{formik.isSubmitting ? "Saving..." : "Save Changes"}
									</button>
								</div>
							)}
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

const renderField = (label, name, formik, editable, type = "text") => (
	<div>
		<label className="block text-sm font-medium text-gray-700 mb-1">
			{label}
		</label>
		{editable ? (
			<div>
				<input
					type={type}
					name={name}
					value={formik.values[name]}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
				/>
				{formik.touched[name] && formik.errors[name] && (
					<p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
				)}
			</div>
		) : (
			<div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-gray-700">
				{formik.values[name] || "-"}
			</div>
		)}
	</div>
);

const renderSelect = (label, name, options, formik, editable) => (
	<div>
		<label className="block text-sm font-medium text-gray-700 mb-1">
			{label}
		</label>
		{editable ? (
			<div>
				<select
					name={name}
					value={formik.values[name]}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
				>
					<option value="">Select {label}</option>
					{options.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>
				{formik.touched[name] && formik.errors[name] && (
					<p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
				)}
			</div>
		) : (
			<div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-gray-700">
				{formik.values[name] || "-"}
			</div>
		)}
	</div>
);

export default Profile;

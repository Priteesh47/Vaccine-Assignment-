import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "../config/axios";

const Register = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		dob: "",
		gender: "",
		address: "",
		phone: "",
		avatar: null
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value, type, files } = e.target;
		if (type === "file") {
			setFormData((prev) => ({ ...prev, [name]: files[0] }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		if (formData.password !== formData.confirmPassword) {
			toast.error("Passwords do not match");
			setLoading(false);
			return;
		}

		try {
			const payload = new FormData();
			for (const key in formData) {
				payload.append(key, formData[key]);
			}

			await axios.post("/users/register", payload, {
				headers: { "Content-Type": "multipart/form-data" }
			});

			toast.success("Registration successful! Please log in.");
			navigate("/login");
		} catch (err) {
			toast.error(err.response?.data?.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen  flex flex-col md:flex-row font-[Outfit]">
			<div className="hidden md:flex md:w-1/2 items-center justify-center bg-white ">
				<img
					src="https://images.unsplash.com/photo-1551929563-fa947bdd52d7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt="Register Illustration"
					className="w-full h-full object-cover"
				/>
			</div>

			<div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
				<div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-2xl">
					<h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
						Create Account
					</h2>
					<form
						onSubmit={handleSubmit}
						className="grid grid-cols-1 md:grid-cols-2 gap-4"
					>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="Full Name"
							className="input-style"
							required
						/>

						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="Email Address"
							className="input-style"
							required
						/>

						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Password"
							className="input-style"
							minLength={6}
							required
						/>

						<input
							type="password"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							placeholder="Confirm Password"
							className="input-style"
							minLength={6}
							required
						/>

						<input
							type="date"
							name="dob"
							value={formData.dob}
							onChange={handleChange}
							className="input-style"
							required
						/>

						<select
							name="gender"
							value={formData.gender}
							onChange={handleChange}
							className="input-style"
							required
						>
							<option value="">Select Gender</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
							<option value="Other">Other</option>
						</select>

						<input
							type="text"
							name="address"
							value={formData.address}
							onChange={handleChange}
							placeholder="Address"
							className="input-style"
							required
						/>

						<input
							type="tel"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							placeholder="Phone Number"
							className="input-style"
							required
						/>

						<div className="col-span-full">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Avatar (optional)
							</label>
							<input
								type="file"
								name="avatar"
								onChange={handleChange}
								accept="image/*"
								className="block w-full border border-gray-300 rounded-lg px-3 py-2"
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="col-span-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
						>
							{loading ? "Creating Account..." : "Create Account"}
						</button>

						<p className="col-span-full text-center text-sm text-gray-600 mt-2">
							Already have an account?{" "}
							<span
								onClick={() => navigate("/login")}
								className="text-blue-600 font-medium cursor-pointer hover:underline"
							>
								Login here
							</span>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;

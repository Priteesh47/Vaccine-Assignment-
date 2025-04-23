import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const { login, isAuthenticated } = useAuth();

	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			email: "",
			password: ""
		},
		validationSchema: Yup.object({
			email: Yup.string().email("Invalid email").required("Email is required"),
			password: Yup.string()
				.min(6, "Password must be at least 6 characters")
				.required("Password is required")
		}),
		onSubmit: async (values, { setSubmitting }) => {
			try {
				await login(values.email, values.password);
				toast.success("Login successful!");
			} catch (error) {
				toast.error("Invalid credentials");
			} finally {
				setSubmitting(false);
			}
		}
	});

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	return (
		<div className="min-h-screen  flex flex-col md:flex-row font-[Outfit]">
			<div className="hidden md:flex md:w-1/2 items-center justify-center bg-white shadow-lg">
				<div className="relative ">
					<img
						src="https://images.unsplash.com/photo-1551929563-fa947bdd52d7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						alt="Login Illustration"
						className="shadow-xl w-full h-[100vh] object-cover"
					/>
					<div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md">
						<h3 className="text-lg font-bold text-blue-700">Secure Access</h3>
						<p className="text-sm text-gray-700">
							Welcome back to your account
						</p>
					</div>
				</div>
			</div>

			<div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
				<div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold text-blue-700 mb-2">
							Welcome Back
						</h2>
						<p className="text-gray-500">Sign in to continue to your account</p>
					</div>
					<form onSubmit={formik.handleSubmit} className="space-y-5">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Email
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
									<svg
										className="w-5 h-5 text-gray-400"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
										/>
									</svg>
								</div>
								<input
									type="email"
									name="email"
									id="email"
									className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="name@example.com"
									{...formik.getFieldProps("email")}
								/>
							</div>
							{formik.touched.email && formik.errors.email && (
								<p className="text-red-500 text-sm mt-1">
									{formik.errors.email}
								</p>
							)}
						</div>

						<div>
							<div className="flex justify-between items-center mb-1">
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700"
								>
									Password
								</label>
							</div>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
									<svg
										className="w-5 h-5 text-gray-400"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/>
									</svg>
								</div>
								<input
									type="password"
									name="password"
									id="password"
									className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="••••••••"
									{...formik.getFieldProps("password")}
								/>
							</div>
							{formik.touched.password && formik.errors.password && (
								<p className="text-red-500 text-sm mt-1">
									{formik.errors.password}
								</p>
							)}
						</div>

						<div className="flex items-center">
							<input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label
								htmlFor="remember-me"
								className="ml-2 block text-sm text-gray-700"
							>
								Remember me
							</label>
						</div>

						<button
							type="submit"
							disabled={formik.isSubmitting}
							className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white py-3 rounded-lg font-medium disabled:opacity-50 shadow-md hover:shadow-lg"
						>
							{formik.isSubmitting ? (
								<div className="flex items-center justify-center">
									<svg
										className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
									Logging in...
								</div>
							) : (
								"Login"
							)}
						</button>

						<p className="text-center text-sm text-gray-600 mt-4">
							Don't have an account?{" "}
							<span
								onClick={() => navigate("/register")}
								className="text-blue-600 font-medium cursor-pointer hover:underline"
							>
								Register here
							</span>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;

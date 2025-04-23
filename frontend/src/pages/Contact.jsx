import React, { useState } from "react";
import { assets } from "../assets/assets";
import Swal from "sweetalert2";

const Contact = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [activeIndex, setActiveIndex] = useState(null);

	const onSubmit = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);

		const formData = new FormData(event.target);
		formData.append("access_key", "58ec7a27-1c38-4335-bb93-6db81a3cd455");

		const object = Object.fromEntries(formData);
		const json = JSON.stringify(object);

		try {
			const res = await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json"
				},
				body: json
			}).then((res) => res.json());

			if (res.success) {
				Swal.fire({
					title: "Message Sent!",
					text: "We'll get back to you as soon as possible.",
					icon: "success"
				});
				event.target.reset();
			}
		} catch (error) {
			Swal.fire({
				title: "Error",
				text: "Something went wrong. Please try again.",
				icon: "error"
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const toggleAccordion = (index) => {
		setActiveIndex(activeIndex === index ? null : index);
	};

	const faqs = [
		{
			question: "How do I register for vaccinations?",
			answer:
				"To register for a vaccine, simply visit our registration page and provide the necessary details. Choose a vaccination center based on your location and book an appointment."
		},
		{
			question: "Can I change my appointment?",
			answer:
				"Yes, you can modify your appointment from the user dashboard. Please ensure to reschedule within the available time slots."
		},
		{
			question: "Is there a way to find nearby vaccination centers?",
			answer:
				"Our system uses geolocation to suggest vaccination centers near you."
		},
		{
			question: "What happens if I miss my appointment?",
			answer:
				"If you miss your scheduled appointment, please reschedule it as soon as possible."
		}
	];

	return (
		<div className="font-sans bg-gray-50">
			<div className="container mx-auto px-4 py-12">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-center text-gray-800 ">
						Contact Us
					</h1>
					<p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
						We'd love to hear from you! If you have any questions, feedback, or
						suggestions, please fill out the form below or reach out to us
						directly at{" "}
					</p>
				</div>

				<div className="max-w-6xl mx-auto bg-white rounded-xl  overflow-hidden">
					<div className="flex flex-col md:flex-row">
						{/* Left section: Form */}
						<div className="w-full md:w-1/2 p-8 lg:p-12">
							<h2 className="text-2xl font-semibold text-gray-800 mb-6">
								Send Us a Message
							</h2>

							<form onSubmit={onSubmit} className="space-y-6">
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Name
									</label>
									<input
										type="text"
										name="name"
										id="name"
										required
										placeholder="Your name"
										className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>

								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Email
									</label>
									<input
										type="email"
										name="email"
										id="email"
										required
										placeholder="your.email@example.com"
										className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>

								<div>
									<label
										htmlFor="message"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Message
									</label>
									<textarea
										name="message"
										id="message"
										required
										rows="5"
										placeholder="How can we help you?"
										className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
									></textarea>
								</div>

								<div>
									<button
										type="submit"
										disabled={isSubmitting}
										className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										{isSubmitting ? (
											<>
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
												Sending...
											</>
										) : (
											"Send Message"
										)}
									</button>
								</div>
							</form>
						</div>

						{/* Right section: Image */}
						<div className="w-full md:w-1/2 bg-gray-100">
							<img
								src="https://images.unsplash.com/photo-1608326389386-0305acbe600f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dmFjY2luZXxlbnwwfHwwfHx8MA%3D%3D"
								alt="Contact Us"
								className="w-full h-full object-cover"
								draggable="false"
							/>
						</div>
					</div>
				</div>

				{/* FAQ Section with Accordion */}
				<div className="max-w-4xl mx-auto mt-16">
					<h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
						Frequently Asked Questions
					</h2>

					<div className="space-y-2">
						{faqs.map((faq, index) => (
							<div
								key={index}
								className="bg-white rounded-lg shadow overflow-hidden transition-all duration-300"
							>
								<button
									onClick={() => toggleAccordion(index)}
									className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
								>
									<h3 className="text-lg font-medium text-gray-900">
										{faq.question}
									</h3>
									<svg
										className={`w-5 h-5 text-gray-500 transform ${
											activeIndex === index ? "rotate-180" : ""
										} transition-transform duration-300`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
								<div
									className={`px-6 overflow-hidden transition-all duration-300 ${
										activeIndex === index ? "max-h-40 pb-4" : "max-h-0"
									}`}
								>
									<p className="text-gray-600">{faq.answer}</p>
								</div>
							</div>
						))}
					</div>

					<div className="mt-8 text-center">
						<p className="text-gray-600">
							Have more questions? Feel free to contact our support team.
						</p>
						<a
							href="mailto:support@vaccino.com"
							className="inline-block mt-2 text-blue-600 hover:underline"
						>
							support@vaccino.com
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Contact;

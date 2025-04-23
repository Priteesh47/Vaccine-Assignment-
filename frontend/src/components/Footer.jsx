import React from "react";

const Footer = () => {
	return (
		<footer className="bg-gradient-to-br from-slate-900 to-gray-950 text-gray-300 py-10">
			<div className="max-w-6xl mx-auto px-6">
				{/* Top Section */}
				<div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-700 pb-6 mb-6">
					<h1 className="text-2xl font-extrabold text-white tracking-wide mb-4 md:mb-0">
						Vaccino
					</h1>
					<div className="flex flex-wrap gap-6 justify-center md:justify-end text-sm">
						<a
							href="/privacy"
							className="hover:text-orange-400 transition duration-300"
						>
							Privacy Policy
						</a>
						<a
							href="/terms"
							className="hover:text-orange-400 transition duration-300"
						>
							Terms of Service
						</a>
						<a
							href="/contact"
							className="hover:text-orange-400 transition duration-300"
						>
							Contact Us
						</a>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="text-sm text-gray-400 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
					<p>© {new Date().getFullYear()} Vaccino. All rights reserved.</p>
					<p className="text-orange-400 font-medium">Stay Healthy 💉</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

import React from "react";

const Loader = () => {
	return (
		<div className="flex flex-col items-center justify-center h-screen w-full bg-blue-50">
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-blue-600">Vaccino</h1>
			</div>

			<div className="relative">
				<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600" />
				<div className="absolute inset-0 rounded-full animate-pulse bg-blue-200 opacity-30 h-16 w-16" />
			</div>
			<p className="mt-4 text-blue-800 font-medium">
				<span className="animate-pulse">
					Hang tight! We're getting things ready for you...
				</span>
			</p>
		</div>
	);
};

export default Loader;

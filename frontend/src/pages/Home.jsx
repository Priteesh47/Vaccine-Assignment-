import React from "react";

import Banner from "../components/Banner";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";

const Home = () => {
	return (
		<div className="bg-gray-50 min-h-screen">
			<Header />
			<SpecialityMenu />
			<Banner />
		</div>
	);
};

export default Home;

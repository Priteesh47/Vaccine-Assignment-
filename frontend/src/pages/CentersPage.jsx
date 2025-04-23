import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPinned, Navigation } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { toast } from "sonner";
import { createCustomIcon } from "../components/CustomIcon";
import Loader from "../components/Loader";
import api from "../config/axios";

const CenterPopup = ({ center }) => {
	return (
		<div className="w-full text-xs">
			{center.image && (
				<div className="w-full h-20 overflow-hidden rounded-t-md">
					<img
						src={center.image}
						alt={center.name}
						onError={(e) =>
							(e.target.src = "https://via.placeholder.com/220x80?text=Center")
						}
						className="w-full h-full object-cover"
					/>
				</div>
			)}
			<div className="p-2 bg-white rounded-b-md shadow-sm">
				<h3 className="text-sm font-semibold text-gray-800 leading-tight">
					{center.name}
				</h3>
				<p className="text-[11px] text-gray-600 mt-1 leading-snug">
					{center.address}, {center.city}, {center.state}
				</p>
				<p className="text-[11px] text-gray-600 mt-1">{center.phone}</p>
				<a
					href={`https://www.google.com/maps/search/?api=1&query=${center.latitude},${center.longitude}`}
					target="_blank"
					className="mt-2 w-full text-white bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded text-xs font-medium flex items-center justify-center transition p-4"
				>
					<Navigation size={12} className="mr-1" />
					Location
				</a>
			</div>
		</div>
	);
};

const CentersPage = () => {
	const [centers, setCenters] = useState([]);
	const [nearbyCenters, setNearbyCenters] = useState([]);
	const [userLocation, setUserLocation] = useState(null);
	const [loading, setLoading] = useState(true);
	const [selectedCenter, setSelectedCenter] = useState(null);
	const mapRef = useRef(null);
	const mapContainerRef = useRef(null);

	console.log(centers, nearbyCenters);

	const fetchCenters = async () => {
		try {
			const res = await api.get("/vaccine-center");
			const sortedCenters = res.data.data.sort(
				(a, b) => new Date(b.created_at) - new Date(a.created_at)
			);
			setCenters(sortedCenters || []);
		} catch {
			toast.error("Failed to load vaccination centers");
		} finally {
			setLoading(false);
		}
	};

	const fetchNearbyCenters = async (lat, lng) => {
		try {
			const res = await api.get(`vaccine-center/nearby?lat=${lat}&lon=${lng}`);
			const sortedCenters = res.data.data.sort(
				(a, b) => new Date(b.created_at) - new Date(a.created_at)
			);
			setNearbyCenters(sortedCenters || []);
		} catch {
			toast.error("Failed to load nearby vaccination centers");
		}
	};

	const getUserLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) =>
					setUserLocation([
						position.coords.latitude,
						position.coords.longitude
					]),
				() => {
					toast.error("Failed to get your location");
					setUserLocation([27.700769, 85.30014]); // Kathmandu default
				}
			);
		} else {
			toast.error("Geolocation is not supported");
			setUserLocation([27.700769, 85.30014]);
		}
	};

	useEffect(() => {
		fetchCenters();
		getUserLocation();
	}, []);

	useEffect(() => {
		if (userLocation) {
			fetchNearbyCenters(userLocation[0], userLocation[1]);
		}
	}, [userLocation]);

	useEffect(() => {
		if (!userLocation || !mapContainerRef.current) return;

		if (mapRef.current) {
			mapRef.current.remove();
		}

		const map = L.map(mapContainerRef.current).setView(userLocation, 13);
		mapRef.current = map;

		L.tileLayer(
			"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
			{ attribution: "© OpenStreetMap contributors © CARTO" }
		).addTo(map);

		L.marker(userLocation, {
			icon: L.divIcon({
				className: "user-marker",
				html: `<div style="background:#2563eb;width:20px;height:20px;border-radius:50%;border:3px solid white;"></div>`
			})
		})
			.addTo(map)
			.bindPopup("<strong>Your Location</strong>");

		centers.forEach((center) => {
			const lat = parseFloat(center.latitude);
			const lng = parseFloat(center.longitude);

			if (isNaN(lat) || isNaN(lng)) return;

			L.marker([lat, lng], { icon: createCustomIcon("#f97316") })
				.addTo(map)
				.bindPopup(
					ReactDOMServer.renderToString(<CenterPopup center={center} />)
				);
		});
	}, [userLocation, centers]);

	if (loading || !userLocation) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader />
			</div>
		);
	}

	return (
		<div className="flex flex-col max-w-screen-2xl mx-auto">
			<div className="p-6 pb-2">
				<h2 className="text-3xl font-bold text-gray-800 mb-2">
					Vaccination Centers Map
				</h2>
				<p className="text-gray-500 mb-4">
					Discover vaccination centers near your location.
				</p>
			</div>
			<div className="flex flex-col md:flex-row gap-6 px-6 pb-6">
				<div className="w-full md:w-3/4 h-[70vh] bg-gray-100 rounded-xl shadow-lg overflow-hidden">
					<div ref={mapContainerRef} className="h-full w-full" />
				</div>
				<div className="w-full md:w-1/4 bg-white p-5 rounded-xl shadow-lg h-[70vh] overflow-y-auto">
					<h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
						<MapPinned className="mr-2 text-orange-500" size={20} />
						Nearby Centers
					</h3>
					<h4 className="text-sm text-gray-600 mb-3 flex items-center font-medium">
						Within 15 km of your location{" "}
						<div className=" mx-2 px-2 rounded-md bg-slate-50">
							<span className="font-semibold text-lg text-orange-500">
								{nearbyCenters.length}
							</span>{" "}
							Centers found.
						</div>
					</h4>
					<div className="space-y-4">
						{nearbyCenters.length > 0 ? (
							nearbyCenters.map((center) => (
								<div
									key={center.id}
									className={`p-4 border rounded-lg cursor-pointer transition ${
										selectedCenter?.id === center.id
											? "bg-orange-50 border-orange-300"
											: "border-gray-200 hover:bg-orange-50"
									}`}
									onClick={() => {
										setSelectedCenter(center);
										if (mapRef.current) {
											const lat = parseFloat(center.latitude);
											const lng = parseFloat(center.longitude);
											if (!isNaN(lat) && !isNaN(lng)) {
												mapRef.current.setView([lat, lng], 15);
											}
										}
									}}
								>
									<CenterPopup center={center} />
								</div>
							))
						) : (
							<p className="text-sm text-gray-500 text-center">
								No nearby centers found within 15 km.
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CentersPage;

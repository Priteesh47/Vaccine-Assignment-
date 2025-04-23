import { Route, Routes, useLocation } from "react-router-dom";
import DashboardLayout from "./components/DashBoardLayout";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import BookAppointment from "./pages/BookAppointment";
import CentersPage from "./pages/CentersPage";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyAppointments from "./pages/MyAppointments";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import VaccinesPage from "./pages/VaccinesPage";
import Appointments from "./pages/dashboard/Appointments/Appointments";
import Centers from "./pages/dashboard/Center/Center";
import CreateEditCenterForm from "./pages/dashboard/Center/CreateOrEditCenterForm";
import DashboardHome from "./pages/dashboard/Home/DashboardHome";
import RegisterStaff from "./pages/dashboard/RegisterStaff/RegisterStaff";
import UsersList from "./pages/dashboard/Users/UsersList";
import CreateEditVaccineForm from "./pages/dashboard/Vaccine/CreateOrUpdateVaccine";
import Vaccines from "./pages/dashboard/Vaccine/Vaccines";
import CreateOrEditVaccineInventoryForm from "./pages/dashboard/VaccineInventory/CreateOrEditVaccineInventoryForm";
import VaccineInventory from "./pages/dashboard/VaccineInventory/VaccineInventory";
import { useAuth } from "./context/AuthContext";
import UserDashboard from "./pages/dashboard/Home/UserDashboard";

const Roles = {
	USER: "User",
	STAFF: "Staff",
	ADMIN: "Admin"
};

function App() {
	const location = useLocation();

	const { user } = useAuth();
	const hideComponents = ["/login", "/register"];
	const isDashboardRoute = location.pathname.startsWith("/dashboard");
	const shouldHideComponent =
		hideComponents.includes(location.pathname) || isDashboardRoute;

	return (
		<div>
			{!shouldHideComponent && <Navbar />}

			<div className="bg-gray-200 min-h-[80vh]">
				<Routes>
					{/* Public */}
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/about" element={<About />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/centers" element={<CentersPage />} />
					<Route path="/vaccines" element={<VaccinesPage />} />

					{/* For All Roles*/}
					<Route
						path="/profile"
						element={
							<ProtectedRoute
								allowedRoles={[Roles.USER, Roles.STAFF, Roles.ADMIN]}
							>
								<Profile />
							</ProtectedRoute>
						}
					/>

					{/* User Routes */}
					<Route
						path="/book-appointment"
						element={
							<ProtectedRoute allowedRoles={[Roles.USER]}>
								<BookAppointment />
							</ProtectedRoute>
						}
					/>

					{/* Staff/Admin Dashboard  */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute
								allowedRoles={[Roles.ADMIN, Roles.STAFF, Roles.USER]}
							>
								<DashboardLayout />
							</ProtectedRoute>
						}
					>
						{user?.role === Roles.USER ? (
							<Route
								index
								element={
									<ProtectedRoute allowedRoles={[Roles.USER]}>
										<UserDashboard />
									</ProtectedRoute>
								}
							/>
						) : (
							<Route
								index
								element={
									<ProtectedRoute allowedRoles={[Roles.ADMIN, Roles.STAFF]}>
										<DashboardHome />
									</ProtectedRoute>
								}
							/>
						)}

						<Route
							path="my-appointments"
							element={
								<ProtectedRoute allowedRoles={[Roles.USER]}>
									<MyAppointments />
								</ProtectedRoute>
							}
						/>

						<Route
							path="appointments"
							element={
								<ProtectedRoute allowedRoles={[Roles.ADMIN, Roles.STAFF]}>
									<Appointments />
								</ProtectedRoute>
							}
						/>

						<Route
							path="vaccines"
							element={
								<ProtectedRoute allowedRoles={[Roles.ADMIN, Roles.STAFF]}>
									<Vaccines />
								</ProtectedRoute>
							}
						/>
						<Route
							path="vaccines/new"
							element={
								<ProtectedRoute allowedRoles={[Roles.ADMIN, Roles.STAFF]}>
									<CreateEditVaccineForm />
								</ProtectedRoute>
							}
						/>
						<Route
							path="vaccines/edit/:id"
							element={
								<ProtectedRoute allowedRoles={[Roles.ADMIN, Roles.STAFF]}>
									<CreateEditVaccineForm />
								</ProtectedRoute>
							}
						/>

						<Route
							path="centers"
							element={
								<ProtectedRoute allowedRoles={[Roles.ADMIN, Roles.STAFF]}>
									<Centers />
								</ProtectedRoute>
							}
						/>
						<Route
							path="centers/new"
							element={
								<ProtectedRoute allowedRoles={[Roles.ADMIN, Roles.STAFF]}>
									<CreateEditCenterForm />
								</ProtectedRoute>
							}
						/>
						<Route
							path="centers/edit/:id"
							element={
								<ProtectedRoute allowedRoles={[Roles.ADMIN, Roles.STAFF]}>
									<CreateEditCenterForm />
								</ProtectedRoute>
							}
						/>

						<Route
							path="inventory"
							element={
								<ProtectedRoute allowedRoles={[Roles.ADMIN, Roles.STAFF]}>
									<VaccineInventory />
								</ProtectedRoute>
							}
						/>
						<Route
							path="inventory/new"
							element={
								<ProtectedRoute allowedRoles={[Roles.ADMIN, Roles.STAFF]}>
									<CreateOrEditVaccineInventoryForm />
								</ProtectedRoute>
							}
						/>
						<Route
							path="inventory/edit/:id"
							element={
								<ProtectedRoute allowedRoles={[Roles.ADMIN, Roles.STAFF]}>
									<CreateOrEditVaccineInventoryForm />
								</ProtectedRoute>
							}
						/>

						<Route
							path="users"
							element={
								<ProtectedRoute allowedRoles={[Roles.ADMIN]}>
									<UsersList />
								</ProtectedRoute>
							}
						/>
						<Route
							path="register-staff"
							element={
								<ProtectedRoute allowedRoles={[Roles.ADMIN]}>
									<RegisterStaff />
								</ProtectedRoute>
							}
						/>
					</Route>

					{/* Fallback */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>

			{!shouldHideComponent && <Footer />}
		</div>
	);
}

export default App;

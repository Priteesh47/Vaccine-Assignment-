import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { testConnection } from "./config/database.js";
import userRoutes from "./routes/user.route.js";
import vaccineRoutes from "./routes/vaccine.route.js";
import vaccinInventoryRoutes from "./routes/vaccineInventory.route.js";
import vaccineCenterRoutes from "./routes/vaccineCenter.route.js";
import appointmentRoutes from "./routes/appointment.route.js";
import path from "path";
import cors from "cors";

dotenv.config({
	path: "./.env"
});
const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(morgan("dev"));
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(process.cwd(), "public")));

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vaccines", vaccineRoutes);
app.use("/api/v1/vaccine-inventory", vaccinInventoryRoutes);
app.use("/api/v1/vaccine-center", vaccineCenterRoutes);
app.use("/api/v1/appointments", appointmentRoutes);

app.use((req, res) => {
	res.status(404).json({
		success: false,
		statusCode: 404,
		message: ` ${req.originalUrl} - route not found`
	});
});

// Global error handler
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";
	res.status(statusCode).json({ success: false, statusCode, message });
});

// Test database connection and start server
testConnection().then(() => {
	app.listen(PORT, () => {
		console.log(`🚀 Server is running on port: ${PORT}`);
	});
});

export default app;

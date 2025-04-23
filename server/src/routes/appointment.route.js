import express from "express";
import {
	cancelAppointment,
	createAppointment,
	getAllAppointmentById,
	getAllAppointments,
	updateAppointmentDetail,
	updateAppointmentStatus
} from "../controllers/appointment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.get(
	"/",
	authMiddleware,
	authorizeRole(["Admin", "Staff"]),
	getAllAppointments
);

router.get(
	"/me",
	authMiddleware,
	(req, res, next) => {
		req.body = {
			userId: req.user.id
		};
		next();
	},
	getAllAppointments
);

router.get("/:id", authMiddleware, getAllAppointmentById);
router.post("/", authMiddleware, createAppointment);
router.put("/:id", authMiddleware, updateAppointmentDetail);
router.patch(
	"/update-status/:id",
	authMiddleware,
	authorizeRole(["Admin", "Staff"]),
	updateAppointmentStatus
);
router.patch(
	"/cancel-appointment/:id",
	authMiddleware,
	authorizeRole(["User"]),
	cancelAppointment
);

export default router;

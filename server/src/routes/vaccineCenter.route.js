import express from "express";
import {
	createVaccineCenter,
	deleteVaccineCenter,
	findNearbyVaccineCenters,
	getAllVaccineCenters,
	getVaccineCenterById,
	updateVaccineCenter
} from "../controllers/vaccineCenter.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorize.middleware.js";
import { upload } from "../config/multer.config.js";

const router = express.Router();

router.get("/", getAllVaccineCenters);
router.get("/nearby", findNearbyVaccineCenters);
router.get("/:id", getVaccineCenterById);
//staff only
router.post(
	"/",
	authMiddleware,
	upload.single("image"),
	authorizeRole(["Admin", "Staff"]),
	createVaccineCenter
);
router.put(
	"/:id",
	authMiddleware,
	authorizeRole(["Staff"]),
	upload.single("image"),
	updateVaccineCenter
);

router.delete(
	"/:id",
	authMiddleware,
	authorizeRole(["Staff"]),
	deleteVaccineCenter
);

export default router;

import express from "express";
import {
  createVaccine,
  deleteVaccine,
  getAllVaccineById,
  getAllVaccines,
  updateVaccine,
} from "../controllers/vaccine.controller.js";
import { upload } from "../config/multer.config.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.get("/", getAllVaccines);
router.get("/:id", getAllVaccineById);

//staff only to create , update and delete vaccine

router.post(
	"/register-vaccine",
	authMiddleware,
	authorizeRole(["Admin", "Staff"]),
	upload.single("image"),
	createVaccine
);

router.put(
	"/update-vaccine/:id",
	authMiddleware,
	authorizeRole(["Admin", "Staff"]),
	upload.single("image"),
	updateVaccine
);
router.delete(
	"/delete-vaccine/:id",
	authMiddleware,
	upload.single("image"),
	authorizeRole(["Admin", "Staff"]),
	deleteVaccine
);
export default router;

import express from "express";
import {
  createVaccineInventory,
  deleteVaccineInventory,
  getAllVaccineInventory,
  getVaccineInventoryById,
  updateVaccineInventory,
} from "../controllers/vaccineInventory.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.get("/", getAllVaccineInventory);
router.get("/:id", getVaccineInventoryById);

//staff only
router.post(
	"/",
	authMiddleware,
	authorizeRole(["Admin", "Staff"]),
	createVaccineInventory
);

router.put(
	"/:id",
	authMiddleware,
	authorizeRole(["Admin", "Staff"]),
	updateVaccineInventory
);

router.delete(
	"/:id",
	authMiddleware,
	authorizeRole(["Admin", "Staff"]),
	deleteVaccineInventory
);

export default router;

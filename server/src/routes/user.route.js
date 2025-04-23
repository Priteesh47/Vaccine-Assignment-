import express from "express";
import {
	createUser,
	deleteUser,
	getAllUsers,
	getMe,
	getUserById,
	login,
	updateUser
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorize.middleware.js";
import { upload } from "../config/multer.config.js";

const router = express.Router();

router.get("/", authMiddleware, authorizeRole(["Admin"]), getAllUsers);
router.get("/me", authMiddleware, getMe);
router.get("/:id", getUserById);
router.post("/register", upload.single("avatar"), createUser);
router.post("/login", login);
router.patch("/:id", upload.single("avatar"), authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.post(
	"/register-staff",
	authMiddleware,
	authorizeRole(["Admin"]),
	upload.single("avatar"),
	(req, res, next) => {
		req.body.role = "Staff";
		next();
	},
	createUser
);

export default router;

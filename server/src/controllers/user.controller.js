import { pool } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import * as bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { deleteFile, getFileUrl } from "../utils/file.js";

export const getAllUsers = async (req, res, next) => {
	// Role not admin and staff
	const [users] = await pool.query(
		`SELECT * FROM users where role != 'Admin' AND role != 'Staff'`
	);

	const userWithoutPassword = users.map((user) => {
		if (user.avatar) {
			user.avatar = getFileUrl(user.avatar);
		}
		const { password, ...rest } = user;
		return rest;
	});
	res.status(200).json({
		status: "success",
		statusCode: 200,
		message: "Users fetched successfully",
		data: userWithoutPassword
	});
};

export const getUserById = async (req, res, next) => {
	const userId = req.params.id;
	const [user] = await pool.query(`SELECT * FROM users WHERE id = ?`, [userId]);

	if (user.length === 0) {
		throw new AppError("User not found", 404);
	}
	const { password, ...rest } = user[0];

	const profile = getFileUrl(rest.avatar);

	res.status(200).json({
		status: "success",
		statusCode: 200,
		message: "User fetched successfully",
		data: { ...rest, avatar: profile }
	});
};

export const createUser = async (req, res, next) => {
	try {
		const {
			name,
			email,
			password,
			confirmPassword,
			dob,
			gender,
			address,
			phone
		} = req.body;

		if (
			!name ||
			!email ||
			!password ||
			!confirmPassword ||
			!dob ||
			!gender ||
			!address ||
			!phone
		) {
			throw new AppError("All fields are required", 400);
		}

		const [existingUser] = await pool.query(
			`SELECT * FROM users WHERE email = ?`,
			[email]
		);

		if (existingUser.length) {
			throw new AppError("User  with this email already exists", 409);
		}

		if (password !== confirmPassword) {
			throw new AppError("Invalid credentails", 400);
		}

		const hashedPassword = await bcryptjs.hash(password, 10);

		const avatar = req.file ? req.file.filename : null;

		await pool.query(
			"INSERT INTO users (name, email, password, dob, gender, role, address, phone, avatar) VALUES (?, ?, ?, ?, ?,?, ?, ?,?)",
			[
				name,
				email,
				hashedPassword,
				dob,
				gender,
				req.body?.role ?? "User",
				address,
				phone,
				avatar
			]
		);

		return res.status(201).json({
			status: "sucess",
			statusCode: 201,
			message: "User registered sucessfully!"
		});
	} catch (error) {
		next(error);
	}
};

export const login = async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new AppError("All Fields are required!", 400);
	}

	try {
		const [result] = await pool.query(`SELECT * FROM users WHERE email= ?`, [
			email
		]);

		const user = result[0];

		if (!user) {
			throw new AppError("Invalid Credentials", 400);
		}

		const isPasswordMatch = bcryptjs.compareSync(password, user.password);

		if (!isPasswordMatch) {
			throw new AppError("Invalid Credentials", 400);
		}

		const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET_KEY, {
			expiresIn: process.env.JWT_EXPIRES_IN
		});

		return res.status(200).json({
			status: "success",
			statusCode: 200,
			message: "User Logged in Sucessfully!",
			data: {
				token
			}
		});
	} catch (error) {
		next(error);
	}
};

export const getMe = async (req, res, next) => {
	return res.status(200).json({
		status: "success",
		statusCode: 200,
		message: "User fetched sucessfully!",
		data: req.user
	});
};

export const updateUser = async (req, res, next) => {
	try {
		const userId = req.params.id;

		const { name, dob, gender, address, phone } = req.body;

		const [existingUser] = await pool.query(
			`SELECT * FROM users WHERE id = ?`,
			[userId]
		);

		if (!existingUser.length) {
			throw new AppError("User not found", 404);
		}
		if (req.user.id !== Number(userId)) {
			throw new AppError("Forbidden! not eligible to update user", 403);
		}

		const avatarToDelete = existingUser[0].avatar;

		const newAvatar = req.file ? req.file.filename : existingUser[0].avatar;

		const updatedUser = {
			name: name || existingUser[0].name,
			dob: dob || existingUser[0].dob,
			gender: gender || existingUser[0].gender,
			address: address || existingUser[0].address,
			phone: phone || existingUser[0].phone,
			avatar: newAvatar
		};

		await pool.query(
			`UPDATE users SET name = ?, dob = ?, gender = ?, address = ?, phone = ?, avatar = ? WHERE id = ?`,
			[
				updatedUser.name,
				updatedUser.dob,
				updatedUser.gender,
				updatedUser.address,
				updatedUser.phone,
				updatedUser.avatar,
				userId
			]
		);

		if (req.file && avatarToDelete) {
			deleteFile(avatarToDelete);
		}

		res.status(200).json({
			status: "success",
			message: "User updated successfully",
			user: { id: userId, ...updatedUser }
		});
	} catch (error) {
		next(error);
	}
};

export const deleteUser = async (req, res, next) => {
	try {
		const userId = req.params.id;

		const [existingUser] = await pool.query(
			`SELECT * FROM users WHERE id = ?`,
			[userId]
		);

		if (!existingUser.length) {
			throw new AppError("User  with this email already exists", 409);
		}

		if (req.user.id !== Number(userId)) {
			throw new AppError("Forbidden! not eligible to delete user", 403);
		}

		if (existingUser[0].avatar) {
			deleteFile(existingUser[0].avatar);
		}
		await pool.query("DELETE FROM users where id=?", [userId]);

		return res.status(200).json({
			status: "sucess",
			statusCode: 200,
			message: "User deleted sucessfully!"
		});
	} catch (error) {
		next(error);
	}
};

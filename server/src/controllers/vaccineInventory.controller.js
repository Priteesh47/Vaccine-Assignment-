import { pool } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { getFileUrl } from "../utils/file.js";

export const getAllVaccineInventory = async (req, res, next) => {
	const [inventories] = await pool.query(`
        SELECT vi.* , v.name, v.image, v.manufacturer, v.description, vc.name AS center_name
        FROM vaccine_inventory vi
        JOIN vaccines v on vi.vaccine_id = v.id
        JOIN vaccine_centers vc ON vi.center_id = vc.id
        `);

	const inventoryWithVaccineDetails = inventories.map((item) => {
		const {
			id,
			vaccine_id,
			center_id,
			quantity,
			expiry_date,
			batch_number,
			image,
			center_name,
			...vaccine
		} = item;

		return {
			id,
			quantity,
			expiry_date,
			batch_number,
			vaccine: {
				id: vaccine_id,
				name: vaccine.name,
				image: image ? getFileUrl(image) : null,
				manufacturer: vaccine.manufacturer,
				description: vaccine.description
			},
			center: {
				id: center_id,
				name: center_name
			}
		};
	});
	res.status(200).json({
		status: "success",
		statusCode: 200,
		message: "Vaccine inventories with vaccine details fetched succssfully",
		data: inventoryWithVaccineDetails
	});
};

export const getVaccineInventoryById = async (req, res, next) => {
	const vaccineInventoryId = req.params.id;

	const [inventory] = await pool.query(
		`  
      SELECT vi.*, v.name, v.image, v.manufacturer, v.description, vc.name AS center_name
      FROM vaccine_inventory vi
      JOIN vaccines v ON vi.vaccine_id = v.id
      JOIN vaccine_centers vc ON vi.center_id = vc.id
      WHERE vi.id = ?
      `,
		[vaccineInventoryId]
	);
	if (inventory.length === 0) {
		throw new AppError("Vaccine inventory not found", 404);
	}
	const {
		id,
		vaccine_id,
		center_id,
		quantity,
		expiry_date,
		batch_number,
		image,
		center_name,
		...vaccine
	} = inventory[0];

	const inventoryWithVaccineDetail = {
		id,
		vaccine_id,
		quantity,
		expiry_date,
		batch_number,
		vaccine: {
			id: vaccine_id,
			name: vaccine.name,
			image: image ? getFileUrl(image) : null,
			manufacturer: vaccine.manufacturer,
			description: vaccine.description
		},
		center: {
			id: center_id,
			name: center_name
		}
	};

	res.status(200).json({
		status: "success",
		statusCode: 200,
		message: "Vaccine inventory fetched successfully",
		data: inventoryWithVaccineDetail
	});
};

export const createVaccineInventory = async (req, res, next) => {
	try {
		const { vaccine_id, center_id, quantity, expiry_date, batch_number } =
			req.body;

		if (quantity === 0 || quantity < 0) {
			throw new AppError("Quantity must be greater than 0", 400);
		}

		console.log(req.body);
		if (
			!vaccine_id ||
			!center_id ||
			!quantity ||
			!expiry_date ||
			!batch_number
		) {
			throw new AppError("All fields are required", 400);
		}

		const expDate = new Date(expiry_date);
		if (isNaN(expDate.getTime()) || expDate <= new Date()) {
			throw new AppError("Expiry date must be a valid future date", 400);
		}

		const [vaccine] = await pool.query(`SELECT * FROM vaccines WHERE id = ?`, [
			vaccine_id
		]);

		if (vaccine.length === 0) {
			throw new AppError("Vaccine not found", 404);
		}

		const [center] = await pool.query(
			`SELECT * FROM vaccine_centers WHERE id = ?`,
			[center_id]
		);
		if (center.length === 0) {
			throw new AppError("Vaccine center not found", 404);
		}

		const [existingBatch] = await pool.query(
			`SELECT * FROM vaccine_inventory WHERE vaccine_id = ? AND batch_number = ?`,
			[vaccine_id, batch_number]
		);
		if (existingBatch.length > 0) {
			throw new AppError(
				`Batch number '${batch_number}' already exists for this vaccine`,
				409
			);
		}

		await pool.query(
			`
        INSERT INTO vaccine_inventory (vaccine_id, center_id, quantity, expiry_date, batch_number)
        VALUES (?, ?, ?, ?, ?)
      `,
			[vaccine_id, center_id, quantity, expiry_date, batch_number]
		);

		res.status(201).json({
			status: "success",
			statusCode: 201,
			message: "Vaccine inventory created successfully"
		});
	} catch (error) {
		next(error);
	}
};

export const updateVaccineInventory = async (req, res, next) => {
	try {
		const vaccineInventoryId = req.params.id;
		const { quantity, expiry_date, batch_number } = req.body;

		const [existingInventory] = await pool.query(
			`SELECT * FROM vaccine_inventory WHERE id = ?`,
			[vaccineInventoryId]
		);

		if (existingInventory.length === 0) {
			throw new AppError("Vaccine inventory not found", 404);
		}

		if (batch_number && batch_number !== existingInventory[0].batch_number) {
			const [duplicateBatch] = await pool.query(
				`SELECT * FROM vaccine_inventory WHERE vaccine_id = ? AND batch_number = ? AND id != ?`,
				[existingInventory[0].vaccine_id, batch_number, vaccineInventoryId]
			);
			if (duplicateBatch.length > 0) {
				throw new AppError(
					`Batch number '${batch_number}' already exists for this vaccine`,
					409
				);
			}
		}

		const updatedQuantity = quantity || existingInventory[0].quantity;
		let updatedExpiryDate = expiry_date || existingInventory[0].expiry_date;
		const updatedBatchNumber =
			batch_number || existingInventory[0].batch_number;

		if (expiry_date) {
			const expDate = new Date(expiry_date);
			if (isNaN(expDate.getTime()) || expDate <= new Date()) {
				throw new AppError("Expiry date must be a valid future date", 400);
			}
			updatedExpiryDate = expiry_date;
		}
		await pool.query(
			`
            UPDATE vaccine_inventory
            SET quantity = ?, expiry_date = ?, batch_number = ?
            WHERE id = ?`,
			[
				updatedQuantity,
				updatedExpiryDate,
				updatedBatchNumber,
				vaccineInventoryId
			]
		);

		res.status(200).json({
			status: "success",
			statusCode: 200,
			message: "Vaccine inventory updated successfully"
		});
	} catch (error) {
		next(error);
	}
};

export const deleteVaccineInventory = async (req, res, next) => {
	try {
		const vaccineInventoryId = req.params.id;

		const [existingInventory] = await pool.query(
			`SELECT * FROM vaccine_inventory WHERE id = ?`,
			[vaccineInventoryId]
		);

		if (existingInventory.length === 0) {
			throw new AppError("Vaccine inventory not found", 404);
		}

		await pool.query(`DELETE FROM vaccine_inventory WHERE id = ?`, [
			vaccineInventoryId
		]);

		res.status(200).json({
			status: "success",
			statusCode: 200,
			message: "Vaccine inventory deleted successfully"
		});
	} catch (error) {
		next(error);
	}
};

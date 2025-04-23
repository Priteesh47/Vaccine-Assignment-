import { pool } from "../config/database.js";
import { AppError } from "../utils/AppError.js";

export const getAllAppointments = async (req, res, next) => {
	const userId = req.body?.userId;
	let appointmentsQuery = `
    SELECT a.*, u.name AS user_name, v.name AS vaccine_name, vc.name as center_name
    FROM appointments a
    JOIN users u ON a.user_id = u.id
    JOIN vaccines v ON a.vaccine_id = v.id
    JOIN vaccine_centers vc ON a.center_id = vc.id
  `;
	let queryParams = [];

	if (userId) {
		appointmentsQuery += ` WHERE a.user_id = ?`;
		queryParams.push(userId);
	}

	const [appointments] = await pool.query(appointmentsQuery, queryParams);

	const formattedAppointments = appointments.map((appointment) => ({
		id: appointment.id,
		dosage_number: appointment.dosage_number,
		appointment_date: appointment.appointment_date,
		status: appointment.status,
		created_at: appointment.created_at,
		user: {
			id: appointment.user_id,
			name: appointment.user_name
		},
		vaccine: {
			id: appointment.vaccine_id,
			name: appointment.vaccine_name
		},
		center: {
			id: appointment.center_id,
			name: appointment.center_name
		}
	}));

	res.status(200).json({
		status: "success",
		statusCode: 200,
		message: "Appointments fetched successfully",
		data: formattedAppointments
	});
};

export const getAllAppointmentById = async (req, res, next) => {
	try {
		const appointmentId = req.params.id;

		const [appointment] = await pool.query(
			`
      SELECT a.*, u.name AS user_name, v.name AS vaccine_name, vc.name AS center_name
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      JOIN vaccines v ON a.vaccine_id = v.id
      JOIN vaccine_centers vc ON a.center_id = vc.id
      WHERE a.id = ?
    `,
			[appointmentId]
		);

		if (appointment.length === 0) {
			throw new AppError("Appointment not found", 404);
		}

		const appt = appointment[0];
		const formattedAppointment = {
			id: appt.id,
			dosage_number: appt.dosage_number,
			appointment_date: appt.appointment_date,
			status: appt.status,
			created_at: appt.created_at,
			user: {
				id: appt.user_id,
				name: appt.user_name
			},
			vaccine: {
				id: appt.vaccine_id,
				name: appt.vaccine_name
			},
			center: {
				id: appt.center_id,
				name: appt.center_name
			}
		};

		res.status(200).json({
			status: "success",
			statusCode: 200,
			message: "Appointment fetched successfully",
			data: formattedAppointment
		});
	} catch (error) {
		next(error);
	}
};

export const createAppointment = async (req, res, next) => {
	try {
		const { vaccine_id, center_id, dosage_number, appointment_date } = req.body;

		const userId = req.user?.id;
		if (!vaccine_id || !center_id || !dosage_number || !appointment_date) {
			throw new AppError("All fields are required", 400);
		}

		const apptDate = new Date(appointment_date);
		if (isNaN(apptDate.getTime()) || apptDate <= new Date()) {
			throw new AppError("Appointment date must be a valid future date", 400);
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

		const [inventory] = await pool.query(
			`SELECT * FROM vaccine_inventory WHERE vaccine_id = ? AND center_id = ? AND quantity > 0 AND expiry_date > CURDATE()`,
			[vaccine_id, center_id]
		);

		if (inventory.length === 0) {
			throw new AppError("No available vaccine inventory at this center", 400);
		}

		const [existingAppointment] = await pool.query(
			`SELECT * FROM appointments WHERE user_id = ? AND vaccine_id = ? AND dosage_number = ? AND status NOT IN ('cancelled', 'rejected')`,
			[userId, vaccine_id, dosage_number]
		);
		if (existingAppointment.length > 0) {
			throw new AppError(
				"An active appointment already exists for this user, vaccine, and dosage",
				409
			);
		}

		await pool.query(
			`
        INSERT INTO appointments (user_id, vaccine_id, center_id, dosage_number, appointment_date)
        VALUES (?, ?, ?, ?, ?)
        `,
			[userId, vaccine_id, center_id, dosage_number, appointment_date]
		);

		res.status(201).json({
			status: "success",
			statusCode: 201,
			message: "Appointment created successfully"
		});
	} catch (error) {
		next(error);
	}
};

export const updateAppointmentDetail = async (req, res, next) => {
	try {
		const appointmentId = req.params.id;
		const userId = req.user?.id;
		const { vaccine_id, center_id, dosage_number, appointment_date } = req.body;

		const [existingAppointment] = await pool.query(
			`SELECT * FROM appointments WHERE id = ?`,
			[appointmentId]
		);
		if (existingAppointment.length === 0) {
			throw new AppError("Appointment not found", 404);
		}

		if (existingAppointment[0].user_id !== userId) {
			throw new AppError(
				"Forbidden not allowed to update this appointment",
				400
			);
		}

		if (
			existingAppointment[0].status === "completed" ||
			existingAppointment[0].status === "rejected"
		) {
			throw new AppError(
				"Cannot update appointment which is completed or rejected",
				400
			);
		}

		if (vaccine_id && vaccine_id !== existingAppointment[0].vaccine_id) {
			const [vaccine] = await pool.query(
				`SELECT * FROM vaccines WHERE id = ?`,
				[vaccine_id]
			);
			if (vaccine.length === 0) {
				throw new AppError("Vaccine not found", 404);
			}
		}

		if (center_id && center_id !== existingAppointment[0].center_id) {
			const [center] = await pool.query(
				`SELECT * FROM vaccine_centers WHERE id = ?`,
				[center_id]
			);
			if (center.length === 0) {
				throw new AppError("Vaccine center not found", 404);
			}
		}

		if (
			(vaccine_id && vaccine_id !== existingAppointment[0].vaccine_id) ||
			(center_id && center_id !== existingAppointment[0].center_id)
		) {
			const checkVaccineId = vaccine_id || existingAppointment[0].vaccine_id;
			const checkCenterId = center_id || existingAppointment[0].center_id;
			const [inventory] = await pool.query(
				`SELECT * FROM vaccine_inventory WHERE vaccine_id = ? AND center_id = ? AND quantity > 0 AND expiry_date > CURDATE()`,
				[checkVaccineId, checkCenterId]
			);

			if (inventory.length === 0) {
				throw new AppError(
					"No available vaccine inventory at this center",
					400
				);
			}
		}

		const updatedVaccineId = vaccine_id || existingAppointment[0].vaccine_id;
		const updatedCenterId = center_id || existingAppointment[0].center_id;
		const updatedDosageNumber =
			dosage_number || existingAppointment[0].dosage_number;
		const updatedAppointmentDate =
			appointment_date || existingAppointment[0].appointment_date;

		// check for duplicate  appointment to update
		const isVaccineIdUpdated =
			vaccine_id && vaccine_id !== existingAppointment[0].vaccine_id;
		const isCenterIdUpdated =
			center_id && center_id !== existingAppointment[0].center_id;
		const isDosageNumberUpdated =
			dosage_number && dosage_number !== existingAppointment[0].dosage_number;
		const isAppointmentDateUpdated =
			appointment_date &&
			appointment_date !== existingAppointment[0].appointment_date;

		if (
			isVaccineIdUpdated ||
			isCenterIdUpdated ||
			isDosageNumberUpdated ||
			isAppointmentDateUpdated
		) {
			const [duplicateAppointment] = await pool.query(
				`
          SELECT * FROM appointments 
          WHERE user_id = ? 
          AND vaccine_id = ? 
          AND center_id = ? 
          AND dosage_number = ? 
          AND appointment_date = ? 
          AND id != ? 
          AND status NOT IN ('cancelled', 'rejected')
        `,
				[
					userId,
					updatedVaccineId,
					updatedCenterId,
					updatedDosageNumber,
					updatedAppointmentDate,
					appointmentId
				]
			);
			if (duplicateAppointment.length > 0) {
				throw new AppError(
					"An active appointment already exists with these details",
					409
				);
			}
		}

		await pool.query(
			`
          UPDATE appointments
          SET vaccine_id = ?, center_id = ?, dosage_number = ?, appointment_date = ?
          WHERE id = ?
        `,
			[
				updatedVaccineId,
				updatedCenterId,
				updatedDosageNumber,
				updatedAppointmentDate,
				appointmentId
			]
		);

		res.status(200).json({
			status: "success",
			statusCode: 200,
			message: "Appointment updated successfully"
		});
	} catch (error) {
		next(error);
	}
};
export const updateAppointmentStatus = async (req, res, next) => {
	try {
		const appointmentId = req.params.id;
		const { status } = req.body;

		if (status !== "completed" && status !== "rejected") {
			throw new AppError("Only 'completed' and 'rejected' are allowed", 400);
		}

		const [existingAppointment] = await pool.query(
			`SELECT * FROM appointments WHERE id = ?`,
			[appointmentId]
		);
		if (existingAppointment.length === 0) {
			throw new AppError("Appointment not found", 404);
		}

		// Check if appointment is in 'scheduled' status
		if (existingAppointment[0].status !== "scheduled") {
			throw new AppError(
				`Cannot change the status of this appointment to ${status}`,
				400
			);
		}

		// Start transaction
		await pool.query("START TRANSACTION");

		try {
			await pool.query(
				`
            UPDATE appointments 
            SET status = ? 
            WHERE id = ?
          `,
				[status, appointmentId]
			);

			// If status is 'completed', decrease inventory quantity
			if (status === "completed") {
				const [inventory] = await pool.query(
					`
              SELECT * FROM vaccine_inventory 
              WHERE vaccine_id = ? AND center_id = ? AND quantity > 0
            `,
					[existingAppointment[0].vaccine_id, existingAppointment[0].center_id]
				);

				if (inventory.length === 0) {
					throw new AppError(
						"No available inventory to complete this appointment",
						400
					);
				}

				const updatedRows = await pool.query(
					`
              UPDATE vaccine_inventory 
              SET quantity = quantity - 1 
              WHERE vaccine_id = ? AND center_id = ? AND quantity > 0
            `,
					[existingAppointment[0].vaccine_id, existingAppointment[0].center_id]
				);

				if (updatedRows[0].affectedRows === 0) {
					throw new AppError(
						"Failed to update inventory: insufficient quantity",
						400
					);
				}
			}

			await pool.query("COMMIT");

			res.status(200).json({
				status: "success",
				statusCode: 200,
				message: `Appointment status updated to '${status}' successfully`
			});
		} catch (error) {
			await pool.query("ROLLBACK");
			throw error;
		}
	} catch (error) {
		next(error);
	}
};

export const cancelAppointment = async (req, res, next) => {
	try {
		const appointmentId = req.params.id;
		const { status } = req.body;
		const userId = req.user?.id;

		if (status !== "cancelled") {
			throw new AppError("Only 'cancelled' status is allowed", 400);
		}

		const [existingAppointment] = await pool.query(
			`SELECT * FROM appointments WHERE id = ?`,
			[appointmentId]
		);
		if (existingAppointment.length === 0) {
			throw new AppError("Appointment not found", 404);
		}

		//only user who created this appointment can cancel
		if (existingAppointment[0].user_id !== userId) {
			throw new AppError("Forbidden not allowed to cancel appointment", 400);
		}

		if (existingAppointment[0].status !== "scheduled") {
			throw new AppError(
				`Cannot change the status of this appointment to ${status}`,
				400
			);
		}

		await pool.query(
			`
          UPDATE appointments 
          SET status = ? 
          WHERE id = ?
        `,
			[status, appointmentId]
		);

		res.status(200).json({
			status: "success",
			statusCode: 200,
			message: "Appointment cancelled successfully"
		});
	} catch (error) {
		next(error);
	}
};

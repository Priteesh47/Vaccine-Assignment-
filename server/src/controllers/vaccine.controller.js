import { pool } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { deleteFile, getFileUrl } from "../utils/file.js";

export const getAllVaccines = async (req, res, next) => {
  const [vaccines] = await pool.query(`SELECT * FROM vaccines`);

  const vaccinesWithImageUrl = vaccines.map((vaccine) => {
    if (vaccine.image) {
      vaccine.image = getFileUrl(vaccine.image);
    }
    return vaccine;
  });
  res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Vaccines fetched successfully",
    data: vaccinesWithImageUrl,
  });
};

export const getAllVaccineById = async (req, res, next) => {
  try {
    const vaccineId = req.params.id;
    const [vaccine] = await pool.query(`SELECT * FROM vaccines WHERE id = ?`, [
      vaccineId,
    ]);

    if (vaccine.length === 0) {
      throw new AppError("Vaccine not found", 404);
    }

    const vaccineData = vaccine[0];
    if (vaccineData.image) {
      vaccineData.image = getFileUrl(vaccineData.image);
    }

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Vaccine fetched successfully",
      data: vaccineData,
    });
  } catch (error) {
    next(error);
  }
};

export const createVaccine = async (req, res, next) => {
  try {
    const { name, manufacturer, description, dosage, age_group } = req.body;

    if (!name || !manufacturer || !description || !dosage || !age_group) {
      throw new AppError("All fields are required", 400);
    }

    const image = req.file ? req.file.filename : null;

    await pool.query(
      "INSERT INTO vaccines (name, manufacturer, description, dosage, age_group, image) VALUES (?, ?, ?, ?, ?, ?)",
      [name, manufacturer, description, dosage, age_group, image]
    );

    res.status(201).json({
      status: "success",
      statusCode: 201,
      message: "Vaccine created successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// update vaccine staff only

export const updateVaccine = async (req, res, next) => {
  try {
    const vaccineId = req.params.id;
    const { name, manufacturer, description, dosage, age_group } = req.body;

    const [existingVaccine] = await pool.query(
      `SELECT * FROM vaccines WHERE id = ?`,
      [vaccineId]
    );

    if (!existingVaccine.length) {
      throw new AppError("Vaccine not found", 404);
    }

    const oldImage = existingVaccine[0].image;
    const newImage = req.file ? req.file.filename : oldImage;

    await pool.query(
      `UPDATE vaccines SET name = ?, manufacturer = ?, description = ?, dosage = ?, age_group = ?, image = ? WHERE id = ?`,
      [
        name || existingVaccine[0].name,
        manufacturer || existingVaccine[0].manufacturer,
        description || existingVaccine[0].description,
        dosage || existingVaccine[0].dosage,
        age_group || existingVaccine[0].age_group,
        newImage,
        vaccineId,
      ]
    );

    if (req.file && oldImage) {
      deleteFile(oldImage);
    }
    res.status(200).json({
      status: "success",
      message: "Vaccine updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVaccine = async (req, res, next) => {
  try {
    const vaccineId = req.params.id;
    const [existingVaccine] = await pool.query(
      `SELECT * FROM vaccines WHERE id = ?`,
      [vaccineId]
    );

    if (!existingVaccine.length) {
      throw new AppError("Vaccine not found", 404);
    }
    if (existingVaccine[0].image) {
      deleteFile(existingVaccine[0].image);
    }
    await pool.query("DELETE FROM vaccines WHERE id = ?", [vaccineId]);

    res.status(200).json({
      status: "success",
      message: "Vaccine deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

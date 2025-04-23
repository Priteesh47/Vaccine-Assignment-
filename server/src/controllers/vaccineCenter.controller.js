import { pool } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { deleteFile, getFileUrl } from "../utils/file.js";

export const getAllVaccineCenters = async (req, res, next) => {
  try {
    const [centers] = await pool.query(
      "SELECT id, name, address, city, state, phone, latitude, longitude, image, created_at FROM vaccine_centers"
    );

    const centersWithImageUrl = centers.map((center) => {
      if (center.image) {
        center.image = getFileUrl(center.image);
      }
      return center;
    });

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Vaccine centers fetched successfully",
      data: centersWithImageUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const getVaccineCenterById = async (req, res, next) => {
  try {
    const centerId = req.params.id;
    const [center] = await pool.query(
      "SELECT id, name, address, city, state, phone, latitude, longitude, image, created_at FROM vaccine_centers WHERE id = ?",
      [centerId]
    );

    if (center.length === 0) {
      throw new AppError("Vaccine center not found", 404);
    }
    const centerData = center[0];
    if (centerData.image) {
      centerData.image = getFileUrl(centerData.image);
    }

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Vaccine center fetched successfully",
      data: centerData,
    });
  } catch (error) {
    next(error);
  }
};

export const createVaccineCenter = async (req, res, next) => {
  try {
    const { name, address, city, state, phone, latitude, longitude } = req.body;

    // Validate required fields
    if (
      !name ||
      !address ||
      !city ||
      !state ||
      !phone ||
      !latitude ||
      !longitude
    ) {
      throw new AppError(
        "All fields (name, address, city, state, phone, latitude, longitude) are required",
        400
      );
    }

    // Validate latitude and longitude
    if (
      isNaN(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      isNaN(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new AppError("Invalid latitude or longitude values", 400);
    }

    const image = req.file ? req.file.filename : null;

    await pool.query(
      "INSERT INTO vaccine_centers (name, address, city, state, phone, latitude, longitude, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, address, city, state, phone, latitude, longitude, image]
    );

    return res.status(201).json({
      status: "success",
      statusCode: 201,
      message: "Vaccine center created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateVaccineCenter = async (req, res, next) => {
  try {
    const centerId = req.params.id;
    const { name, address, city, state, phone, latitude, longitude } = req.body;

    const [existingCenter] = await pool.query(
      "SELECT * FROM vaccine_centers WHERE id = ?",
      [centerId]
    );

    if (!existingCenter.length) {
      throw new AppError("Vaccine center not found", 404);
    }

    const oldImage = existingCenter[0].image;
    const newImage = req.file ? req.file.filename : existingCenter[0].image;

    // Validate latitude and longitude if provided
    if (
      latitude !== undefined &&
      (isNaN(latitude) || latitude < -90 || latitude > 90)
    ) {
      throw new AppError("Invalid latitude value", 400);
    }
    if (
      longitude !== undefined &&
      (isNaN(longitude) || longitude < -180 || longitude > 180)
    ) {
      throw new AppError("Invalid longitude value", 400);
    }

    const updatedCenter = {
      name: name || existingCenter[0].name,
      address: address || existingCenter[0].address,
      city: city || existingCenter[0].city,
      state: state || existingCenter[0].state,
      phone: phone || existingCenter[0].phone,
      latitude: latitude !== undefined ? latitude : existingCenter[0].latitude,
      longitude:
        longitude !== undefined ? longitude : existingCenter[0].longitude,
      image: newImage,
    };

    await pool.query(
      "UPDATE vaccine_centers SET name = ?, address = ?, city = ?, state = ?, phone = ?, latitude = ?, longitude = ?, image = ? WHERE id = ?",
      [
        updatedCenter.name,
        updatedCenter.address,
        updatedCenter.city,
        updatedCenter.state,
        updatedCenter.phone,
        updatedCenter.latitude,
        updatedCenter.longitude,
        updatedCenter.image,
        centerId,
      ]
    );

    if (req.file && oldImage) {
      deleteFile(oldImage);
    }

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Vaccine center updated successfully",
      data: { id: centerId, ...updatedCenter },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVaccineCenter = async (req, res, next) => {
  try {
    const centerId = req.params.id;

    const [existingCenter] = await pool.query(
      "SELECT * FROM vaccine_centers WHERE id = ?",
      [centerId]
    );

    if (!existingCenter.length) {
      throw new AppError("Vaccine center not found", 404);
    }

    if (existingCenter[0].image) {
      deleteFile(existingCenter[0].image);
    }

    await pool.query("DELETE FROM vaccine_centers WHERE id = ?", [centerId]);

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Vaccine center deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const findNearbyVaccineCenters = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;

    // Validate latitude and longitude
    if (!lat || !lon) {
      throw new AppError("Latitude and longitude are required", 400);
    }
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    if (
      isNaN(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      isNaN(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new AppError("Invalid latitude or longitude values", 400);
    }

    // Haversine formula to calculate distance
    const query = `
      SELECT id, name, address, city, state, phone, latitude, longitude, image, created_at,
        (
          6371 * acos(
            cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) +
            sin(radians(?)) * sin(radians(latitude))
          )
        ) AS distance
      FROM vaccine_centers
      HAVING distance <= 15
      ORDER BY distance
    `;
    const [centers] = await pool.query(query, [latitude, longitude, latitude]);

    const centersWithImageUrl = centers.map((center) => {
      if (center.image) {
        center.image = getFileUrl(center.image);
      }
      // Round distance to 2 decimal places
      center.distance = parseFloat(center.distance.toFixed(2));
      return center;
    });

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: centersWithImageUrl.length
        ? "Nearby vaccine centers fetched successfully"
        : "No vaccine centers found within 15 km",
      data: centersWithImageUrl,
    });
  } catch (error) {
    next(error);
  }
};

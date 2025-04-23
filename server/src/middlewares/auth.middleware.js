import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { pool } from "../config/database.js";
import { getFileUrl } from "../utils/file.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req?.headers?.authorization;

    const token = authHeader?.split(" ")[1];
    if (!token) {
      throw new AppError("No token provided", 404);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      throw new AppError("Unauthorized", 401);
    }

    const [result] = await pool.query(`SELECT * FROM users WHERE id=?`, [
      decoded?.id,
    ]);

    const user = result[0];

    const avatar = user?.avatar ? getFileUrl(user.avatar) : null;

    if (!user) {
      throw new AppError("Unauthorized", 401);
    }
    const { password, ...rest } = user;
    req.user = { ...rest, avatar };
    next();
  } catch (error) {
    throw new AppError(error.message);
  }
};

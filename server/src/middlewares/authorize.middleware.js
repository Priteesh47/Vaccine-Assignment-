import { AppError } from "../utils/AppError.js";

export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        "Forbidden!, you're not authorize to access this route",
        403
      );
    }

    next();
  };
};

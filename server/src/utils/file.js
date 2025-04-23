import path from "path";
import fs from "fs";

export const getFileUrl = (fileName) => {
  if (!fileName) return null;

  return `${process.env.BASE_URL}/public/${fileName}`;
};

export const deleteFile = (fileName) => {
  if (!fileName) return null;

  const fullPath = path.join(path.resolve(), "public", fileName);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    return true;
  }
};

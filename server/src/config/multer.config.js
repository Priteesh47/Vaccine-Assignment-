import multer from "multer";
import path from "path";
import fs from "fs";

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

const fileDir = path.join(path.resolve(), "public");

// If the directory does not exist, create it
if (!fs.existsSync(fileDir)) {
  fs.mkdirSync(fileDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, fileDir);
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(extname)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type not allowed. Allowed types are: ${allowedExtensions.join(
          ", "
        )}`
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
});

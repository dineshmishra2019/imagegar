// src/middleware/videoMiddleware.js
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/videos/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["video/mp4", "video/mkv", "video/avi", "video/mov"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid video type"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload; // ✅ default export
export const videoUpload = upload.single("video"); // ✅ named export for single video upload

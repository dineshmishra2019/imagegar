import express from "express";
import { getVideos, uploadVideo, deleteVideo, downloadVideo } from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/videoMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'src/videos/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const videos = multer({ storage });

router.route("/").get(getVideos).post(protect, upload.single("video"), uploadVideo); // 👈 field is "video"
router.route("/:id").delete(protect, deleteVideo);
router.route("/:id/download").get(downloadVideo);

export default router;

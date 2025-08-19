import express from 'express';
import path from 'path';
import multer from 'multer';
import { getImages, uploadImage } from '../controllers/imageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'src/uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.route('/')
  .get(getImages)
  .post(protect, upload.single('image'), uploadImage);

export default router;
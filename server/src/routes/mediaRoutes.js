import express from 'express';
import { getMedia, uploadMedia } from '../controllers/mediaController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';



const router = express.Router();

router.route('/').get(getMedia).post(protect, upload.single('file'), uploadMedia);

export default router;
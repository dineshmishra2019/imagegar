import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/videos', videoRoutes);


app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/uploads/videos', express.static(path.join(__dirname, '/uploads/videos')));

// Create the uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads/videos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage configuration for local disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // The path where videos will be stored
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to prevent overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 1000 * 1000 * 500 }, // 500 MB limit
  fileFilter: (req, file, cb) => {
    // Accept only video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});


// Video upload endpoint
app.post('/api/upload/video', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // The file has been saved locally
    const fileUrl = `/uploads/${req.file.filename}`;

    // You would save fileUrl to your database here
    // e.g., new Video({ filename: req.file.originalname, filePath: fileUrl }).save();
    
    res.status(200).json({
      message: 'Video uploaded successfully!',
      url: fileUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during video upload.' });
  }
});


// A simple route to test the server
app.get('/', (req, res) => {
  res.send('Server is running and ready for video uploads.');
});


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
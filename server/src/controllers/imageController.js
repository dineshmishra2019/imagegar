import Image from '../models/Image.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const getImages = async (req, res) => {
  const images = await Image.find({}).populate('user', 'name');
  res.json(images);
};

export const uploadImage = async (req, res) => {
  const { title } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('Please select an image');
  }

  const image = new Image({
    title,
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
    user: req.user._id,
  });

  const createdImage = await image.save();
  res.status(201).json(createdImage);
};

export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Check if user owns the image
    if (image.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // The image path is relative to the server root, e.g., /uploads/filename.jpg
    const filePath = path.join(__dirname, '..', '..', image.path);

    fs.unlink(filePath, async (err) => {
      if (err) {
        // Log error but proceed to delete from DB
        console.error('Failed to delete file from disk:', err);
      }
      await image.deleteOne();
      res.json({ message: 'Image removed' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting image.' });
  }
};

export const downloadImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, '..', '..', image.path);

    res.download(filePath, image.filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Could not download the file.' });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while downloading image.' });
  }
};
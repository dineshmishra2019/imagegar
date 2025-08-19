// src/controllers/videoController.js

import Video from "../models/Videos.js"; // assuming you have a Mongoose model
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// GET /api/videos
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate('user', 'name').sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch videos" });
  }
};

// POST /api/videos
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const video = new Video({
      title: req.body.title,
      filename: req.file.filename,
      path: `/uploads/videos/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
      user: req.user._id, // if you want to track uploader
    });

    await video.save();
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: "Video upload failed" });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, '..', '..', video.path);

    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error('Failed to delete file from disk:', err);
      }
      await video.deleteOne();
      res.json({ message: 'Video removed' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting video.' });
  }
};

export const downloadVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, '..', '..', video.path);

    res.download(filePath, video.filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Could not download the file.' });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while downloading video.' });
  }
};

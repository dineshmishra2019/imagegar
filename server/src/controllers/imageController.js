import Image from '../models/Image.js';

export const getImages = async (req, res) => {
  // For now, gets all images. Can be scoped to user later.
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
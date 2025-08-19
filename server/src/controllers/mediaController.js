import Media from '../models/Media.js';
import Videos from '../models/Videos.js';


export const getMedia = async (req, res) => {
  const media = await Media.find({}).populate('user', 'name').sort({ createdAt: -1 });
  res.json(media);
};

export const uploadMedia = async (req, res) => {
  const { title } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('Please select a file');
  }

  const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

  const media = new Media({
    title,
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
    user: req.user._id,
    mediaType,
    mimetype: req.file.mimetype,
  });

  const createdMedia = await media.save();
  res.status(201).json(createdMedia);
};
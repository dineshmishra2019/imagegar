import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);
export default Image;
import React from 'react';
import { useState } from 'react';
import API from '../services/api';

const ImageUpload = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', file);

    try {
      await API.post('/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Image uploaded successfully!');
      setTitle('');
      setFile(null);
      e.target.reset(); // Reset file input
    } catch (error) {
      setMessage(error.response?.data?.message || 'Image upload failed.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
      {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Image Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Image File</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full" required />
        </div>
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">Upload</button>
      </form>
    </div>
  );
};

export default ImageUpload;
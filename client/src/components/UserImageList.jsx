import React, { useState } from 'react';
import API from '../services/api';

const UserImageList = ({ images, onImageDeleted }) => {
  const [message, setMessage] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await API.delete(`/images/${id}`);
        onImageDeleted(id);
      } catch (error) {
        console.error('Failed to delete image:', error);
        alert('Failed to delete image.');
      }
    }
  };

  const handleCopyLink = (path) => {
    const url = `http://localhost:5001${path}`;
    navigator.clipboard.writeText(url).then(() => {
      setMessage('Link copied to clipboard!');
      setTimeout(() => setMessage(''), 2000);
    }).catch(err => {
      console.error('Failed to copy link:', err);
    });
  };

  if (!images || images.length === 0) {
    return <p>You have not uploaded any images yet.</p>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Your Images</h3>
      {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image._id} className="border rounded-lg overflow-hidden shadow-lg">
            <img src={`http://localhost:5001${image.path}`} alt={image.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h4 className="text-lg font-semibold truncate">{image.title}</h4>
              <div className="flex justify-between items-center mt-4 space-x-2">
                <a
                  href={`http://localhost:5001/api/images/${image._id}/download`}
                  download
                  className="text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                >
                  Download
                </a>
                <button
                  onClick={() => handleCopyLink(image.path)}
                  className="text-sm bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600"
                >
                  Share
                </button>
                <button
                  onClick={() => handleDelete(image._id)}
                  className="text-sm bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserImageList;
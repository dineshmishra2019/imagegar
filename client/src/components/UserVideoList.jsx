import React, { useState } from 'react';
import API from '../services/api';

const UserVideoList = ({ videos, onVideoDeleted }) => {
  const [message, setMessage] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await API.delete(`/videos/${id}`);
        onVideoDeleted(id);
      } catch (error) {
        console.error('Failed to delete video:', error);
        alert('Failed to delete video.');
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

  if (!videos || videos.length === 0) {
    return <p>You have not uploaded any videos yet.</p>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Your Videos</h3>
      {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video._id} className="border rounded-lg overflow-hidden shadow-lg">
            <video controls className="w-full h-48 object-cover bg-black">
              <source src={`http://localhost:5001${video.path}`} type={video.mimetype} />
              Your browser does not support the video tag.
            </video>
            <div className="p-4">
              <h4 className="text-lg font-semibold truncate">{video.title}</h4>
              <div className="flex justify-between items-center mt-4 space-x-2">
                <a
                  href={`http://localhost:5001/api/videos/${video._id}/download`}
                  download
                  className="text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                >
                  Download
                </a>
                <button
                  onClick={() => handleCopyLink(video.path)}
                  className="text-sm bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600"
                >
                  Share
                </button>
                <button
                  onClick={() => handleDelete(video._id)}
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

export default UserVideoList;
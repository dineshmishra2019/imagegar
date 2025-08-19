import React, { useState, useEffect } from 'react';
import API from '../services/api';

const HomePage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await API.get('/images');
        setImages(data);
      } catch (error) {
        console.error('Failed to fetch images:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (loading) return <p>Loading images...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Public Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map(image => (
          <div key={image._id} className="border rounded-lg overflow-hidden shadow-lg">
            <img src={`http://localhost:5001${image.path}`} alt={image.title} className="w-full h-64 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{image.title}</h2>
              <p className="text-gray-600">Uploaded by: {image.user.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
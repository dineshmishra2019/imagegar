import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import ImageUpload from '../components/ImageUpload';
import VideoUpload from '../components/VideoUpload';
import UserImageList from '../components/UserImageList';
import UserVideoList from '../components/UserVideoList';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMedia = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [imagesRes, videosRes] = await Promise.all([
        API.get('/images'),
        API.get('/videos'),
      ]);

      // A better approach would be a dedicated backend endpoint to get user-specific media
      if (user && user._id) {
        setImages(imagesRes.data.filter(img => img.user && img.user._id === user._id));
        setVideos(videosRes.data.filter(vid => vid.user && vid.user._id === user._id));
      }
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchMedia();
    }
  }, [user, navigate, fetchMedia]);

  const handleImageDeleted = (deletedId) => {
    setImages(currentImages => currentImages.filter(image => image._id !== deletedId));
  };

  const handleVideoDeleted = (deletedId) => {
    setVideos(currentVideos => currentVideos.filter(video => video._id !== deletedId));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-8">Welcome, {user?.name}. Use the forms below to upload your content.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ImageUpload onUploadSuccess={fetchMedia} />
        <VideoUpload onUploadSuccess={fetchMedia} />
      </div>

      <div className="mt-12 border-t pt-8">
        {loading ? (
          <p>Loading your media...</p>
        ) : (
          <>
            <UserImageList images={images} onImageDeleted={handleImageDeleted} />
            <div className="mt-8">
              <UserVideoList videos={videos} onVideoDeleted={handleVideoDeleted} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
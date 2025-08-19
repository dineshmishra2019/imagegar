import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload.jsx';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}</h1>
      <p className="mb-6">This is your dashboard. You can upload new images here.</p>
      <ImageUpload />
      {/* User's image list will go here */}
    </div>
  );
};

export default DashboardPage;
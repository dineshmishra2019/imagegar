import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          ImageGAR
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-600 hover:text-gray-800">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">Dashboard</Link>
              <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-gray-800">Login</Link>
              <Link to="/register" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Admin_Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');
  const adminData = JSON.parse(localStorage.getItem('adminData'));
  console.log('adminData:', adminData);
  
  const handleback = () => {
    navigate('/Admin_Dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-800">Admin Profile</h1>
          </div>
          <p className="text-gray-500 text-sm">View your profile information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Image Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8">
            <div className="flex flex-col items-center">
              {/* Profile Image */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg">
                {adminData?.admin_image ? (
                  <img
                    src={`http://localhost:3500${adminData.admin_image}`}
                    alt={adminData.full_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                    <span className="text-white text-4xl font-bold">
                      {adminData?.full_name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-white mt-4">{adminData?.full_name}</h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white mt-2">
                Administrator
              </span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Full Name
                </label>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-gray-800 font-medium">{adminData?.full_name || 'N/A'}</p>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Email Address
                </label>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-gray-800 font-medium">{adminData?.email || 'N/A'}</p>
                </div>
              </div>

              {/* Password Hash (Hidden for security - show placeholder) */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Password
                </label>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                 <p>{adminData?.password_hash}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  localStorage.removeItem('adminData');
                  window.location.href = '/Admin_Login';
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105"
              >
                Logout
              </button>
              <button 
                onClick={handleback} 
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin_Profile
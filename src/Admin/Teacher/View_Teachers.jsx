import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminAuthService } from '../../service/adminauth';

const View_Teachers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { teacherId } = location.state || {};
  
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTeacherDetails = async () => {
    if (!teacherId) {
      setError('No teacher ID provided');
      setLoading(false);
      console.error('No teacherId provided');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {     
      const result = await adminAuthService.getteacherbyid(teacherId);
      console.log('API Response for teacher details:', result);
      
      if (result.success) {
        setTeacher(result.teacher);
      } else {
        setError(result.message || 'Failed to fetch teacher details');
        console.error('Failed to fetch teacher details:', result.message);
      }
    } catch (error) {
      console.error('Error fetching teacher details:', error);
      setError('An error occurred while fetching teacher details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherDetails();
  }, [teacherId]);

  const handleBack = () => {
    navigate('/admin/teachers');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teacher details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md text-center">
          <p className="text-gray-600 mb-4">No teacher data found</p>
          <button
            onClick={handleBack}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Teacher Details</h1>
        </div>

        {/* Teacher Details Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Image */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Image */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg">
                {teacher.profile_image_url ? (
                  <img
                    src={`http://localhost:3500${teacher.profile_image_url}`}
                    alt={teacher.full_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                    <span className="text-white text-5xl font-bold">
                      {teacher.full_name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Name and Status */}
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {teacher.full_name}
                </h2>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm">
                  <span className={`w-2 h-2 rounded-full mr-2 ${teacher.is_active ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  {teacher.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                  Email Address
                </label>
                <p className="text-lg text-gray-800 mt-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                  {teacher.email}
                </p>
              </div>

              {/* Teacher ID */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                  Teacher ID
                </label>
                <p className="text-lg text-gray-800 mt-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                  </svg>
                  #{teacher.teacher_id}
                </p>
              </div>

              {/* Created At */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                  Joined Date
                </label>
                <p className="text-lg text-gray-800 mt-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  {teacher.created_at ? new Date(teacher.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>

              {/* Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                  Account Status
                </label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    teacher.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {teacher.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4 justify-end">
              <button
                onClick={() => navigate('/Teacher_Dashboard')}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View_Teachers;
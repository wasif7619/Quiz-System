import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminAuthService } from '../../service/adminauth';

const Edit_Teacher = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { teacherId } = location.state || {};
  
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form fields
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password_hash, setPasswordHash] = useState('');
  const [is_active, setIsActive] = useState(false);
  const [profile_image, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [currentImage, setCurrentImage] = useState('');

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
        // Populate form fields
        setFullName(result.teacher.full_name);
        setEmail(result.teacher.email);
        setIsActive(result.teacher.is_active === true);
        setCurrentImage(result.teacher.profile_image_url);
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

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare data for update
      const teacherData = {
        full_name: full_name,
        email: email,
        is_active: is_active
      };
      
      if (password_hash) {
        teacherData.password_hash = password_hash;
      }      
      const result = await adminAuthService.updateteacherbyid(teacherId, teacherData);
      
      if (result.success) {
        setSuccess('Teacher updated successfully!');
        setTimeout(() => {
          navigate('/Teacher_Dashboard');
        }, 2000);
      } else {
        setError(result.message || 'Failed to update teacher');
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
      setError('An error occurred while updating teacher');
    } finally {
      setLoading(false);
    }
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

  if (error && !teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Edit Teacher</h1>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Edit Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-purple-500 shadow-md">
                    {(previewImage || currentImage) ? (
                      <img
                        src={previewImage || `http://localhost:3500${currentImage}`}
                        alt="Teacher Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                        <span className="text-white text-4xl font-bold">
                          {full_name?.charAt(0).toUpperCase() || 'T'}
                        </span>
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer hover:bg-purple-700 transition">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">Click on camera to change image</p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={full_name}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Password*/}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password_hash}
                    onChange={(e) => setPasswordHash(e.target.value)}
                    placeholder="Leave blank to keep current password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Status
                  </label>
                  <div className="flex items-center space-x-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={is_active === true}
                        onChange={() => setIsActive(true)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={is_active === false}
                        onChange={() => setIsActive(false)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Inactive</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/Teacher_Dashboard')}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit_Teacher;
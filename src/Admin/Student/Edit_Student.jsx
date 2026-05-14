import React, { useState } from 'react'
import { adminAuthService } from '../../service/adminauth';
import { useLocation, useNavigate } from 'react-router-dom';

const Edit_Student = () => {
  const location = useLocation();
  const student= location.state?.student || {};
  console.log('Received student data in Edit_Student:', student);
  const studentId = location.state?.student?.student_id;
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(student.full_name || '');
  const [className, setClassName] = useState(student.class_name || '');
  const [password_hash, setPasswordHash] = useState(student.password_hash || '');
  const [email, setEmail] = useState(student.email || '');
  const [profileImage, setProfileImage] = useState(null);
  const [isActive, setIsActive] = useState(student.is_active !== undefined ? student.is_active : true);
  const [previewImage, setPreviewImage] = useState(student.profile_image_url ? `http://localhost:3500${student.profile_image_url}`:'');
  const [loading, setLoading] = useState(false);

  
  const handleback = () => {
    navigate('/Student_Dashboard');
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('class_name', className);
    formData.append('email', email);
    formData.append('password_hash', password_hash);
    formData.append('is_active', isActive);
    if (profileImage) {
      formData.append('profile_image', profileImage);
    }
    try {
      const result = await adminAuthService.updatestudentbyid(studentId, formData);
      console.log('API Response for updating student:', result);
      if (result.success) {
        alert('Student updated successfully');
        navigate('/Student_Dashboard');
      } else {
        alert(result.message || 'Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('An error occurred while updating student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Student</h1>
          <p className="text-gray-600">Update student information</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-purple-500 shadow-md">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer hover:bg-purple-700 transition">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={password_hash}
                  onChange={(e) => setPasswordHash(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Class Name
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Enter class name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active Status</span>
                </label>
                <span className={`text-sm ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {isActive ? 'Student is active' : 'Student is inactive'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  'Update Student'
                )}
              </button>
              <button
                type="button"
                onClick={handleback}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Edit_Student;
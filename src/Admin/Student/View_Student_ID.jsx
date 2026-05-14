import React, { useEffect } from 'react'
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminAuthService } from '../../service/adminauth';

const View_Student_ID = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const studentId = location.state?.studentId;
  const [student, setStudent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudentDetails = async () => {
    if (!studentId) {
      setError('No student ID provided');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await adminAuthService.getstudentbyid(studentId);
      console.log('API Response for student details:', result);
      if (result.success) {
        setStudent(result.student);
      } else {
        setError(result.message || 'Failed to fetch student details');
      }
    } catch (err) {
      setError('An error occurred while fetching student details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const handleBack = () => {
    navigate("/Student_Dashboard");
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading student details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Student Details</h1>
        </div>

        {/* Student Details Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Image */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8">
            <div className="flex flex-col items-center">
              {/* Profile Image */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg">
                {student.profile_image_url ? (
                  <img
                    src={`http://localhost:3500${student.profile_image_url}`}
                    alt={student.full_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                    <span className="text-white text-4xl font-bold">
                      {student.full_name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Name and Status */}
              <div className="text-center mt-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {student.full_name}
                </h2>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm">
                  <span className={`w-2 h-2 rounded-full mr-2 ${student.is_active ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  {student.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Email */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                  Email Address
                </label>
                <p className="text-lg text-gray-800 mt-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                  {student.email}
                </p>
              </div>

              {/* Class Name */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                  Class Name
                </label>
                <p className="text-lg text-gray-800 mt-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  {student.class_name}
                </p>
              </div>

              {/* Student ID */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                  Student ID
                </label>
                <p className="text-lg text-gray-800 mt-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                  </svg>
                  #{student.student_id}
                </p>
              </div>

              {/* Joined Date */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                  Joined Date
                </label>
                <p className="text-lg text-gray-800 mt-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleBack}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default View_Student_ID
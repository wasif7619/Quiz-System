import React, { useEffect, useState } from 'react'
import { adminAuthService } from '../service/adminauth';

const Assign_students_to_classes = () => {
  const [AssignedStudents, setAssignedStudents] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const assignStudentToClass = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage('');
    try {
      const response = await adminAuthService.assignStudentToClass({
        student_full_name: studentName,
        teacher_full_name: teacherName,
        class_name: className
      });
      setSuccessMessage('Student assigned successfully!');
      setStudentName('');
      setTeacherName('');
      setClassName('');
      fetchAssignedStudents();
    } catch (err) {
      setError('Failed to assign student to class');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedStudents();
  }, []);

  const fetchAssignedStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAuthService.getAllAssignments();
      setAssignedStudents(response.data);
    } catch (err) {
      setError('Failed to fetch assigned students');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-6">
      {/* Header Section */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
          Assign Students to Classes
        </h1>
        <p className="text-gray-500 text-xs md:text-sm">
          Assign teachers to students and manage class assignments
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-lg mb-4 max-w-md mx-auto text-sm">
          <p>{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded-lg mb-4 max-w-md mx-auto text-sm">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Assignment Form Box - Vertical & Compact */}
      <div className="max-w-md mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2">
            <h2 className="text-sm font-semibold text-white">New Assignment</h2>
          </div>
          <div className="p-4">
            {/* Vertical Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  placeholder="Enter student name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Teacher Name
                </label>
                <input
                  type="text"
                  placeholder="Enter teacher name"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Class Name
                </label>
                <input
                  type="text"
                  placeholder="Enter class name"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={assignStudentToClass}
                disabled={!studentName || !teacherName || !className}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-1.5 px-4 rounded-md transition duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign Student to Class
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Students List - Full Page */}
      {!loading && !error && (
        <div className="w-full">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2">
              <div className="flex justify-between items-center">
                <h2 className="text-sm md:text-base font-semibold text-white">
                  Assigned Students
                </h2>
                <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs">
                  Total: {AssignedStudents.length}
                </span>
              </div>
            </div>

            {AssignedStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No assignments found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {AssignedStudents.map((student, index) => (
                      <tr key={student.student_name || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                              {student.profile_image_url ? (
                                <img
                                  src={`http://localhost:3500${student.profile_image_url}`}
                                  alt={student.teacher_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-purple-500 text-white text-xs font-bold">
                                  {student.teacher_name?.charAt(0).toUpperCase() || 'T'}
                                </div>
                              )}
                            </div>
                            <span className="font-medium text-gray-800 text-xs">
                              {student.teacher_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                              {student.student_profile_image_url ? (
                                <img
                                  src={`http://localhost:3500${student.student_profile_image_url}`}
                                  alt={student.student_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-green-500 text-white text-xs font-bold">
                                  {student.student_name?.charAt(0).toUpperCase() || 'S'}
                                </div>
                              )}
                            </div>
                            <span className="text-gray-800 text-xs">{student.student_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                            {student.class_name}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                          {student.assigned_date ? new Date(student.assigned_date).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Assign_students_to_classes
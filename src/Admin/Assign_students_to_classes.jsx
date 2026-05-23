import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { adminAuthService } from '../service/adminauth';

const Assign_students_to_classes = () => {
  const [AssignedStudents, setAssignedStudents] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  //UnAssign student from class
  const [unassigning, setUnassigning] = useState(false);
  // Dropdown states
  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const [teacherSuggestions, setTeacherSuggestions] = useState([]);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);
  const [searchingStudent, setSearchingStudent] = useState(false);
  const [searchingTeacher, setSearchingTeacher] = useState(false);

  // All students and teachers for filtering
  const [allStudents, setAllStudents] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);

  const navigate = useNavigate();
  const studentRef = useRef(null);
  const teacherRef = useRef(null);

  // Fetch all students and teachers on load
  useEffect(() => {
    Fetch_Student();
    Fetch_Teacher();
    fetchAssignedStudents();
  }, []);

  // Filter students when typing
  useEffect(() => {
    if (studentName.length > 1) {
      const filtered = allStudents.filter(student =>
        student.full_name.toLowerCase().includes(studentName.toLowerCase())
      );
      setStudentSuggestions(filtered);
      setShowStudentDropdown(filtered.length > 0);
      setSearchingStudent(false);
    } else {
      setStudentSuggestions([]);
      setShowStudentDropdown(false);
    }
  }, [studentName, allStudents]);

  // Filter teachers when typing
  useEffect(() => {
    if (teacherName.length > 1) {
      const filtered = allTeachers.filter(teacher =>
        teacher.full_name.toLowerCase().includes(teacherName.toLowerCase())
      );
      setTeacherSuggestions(filtered);
      setShowTeacherDropdown(filtered.length > 0);
      setSearchingTeacher(false);
    } else {
      setTeacherSuggestions([]);
      setShowTeacherDropdown(false);
    }
  }, [teacherName, allTeachers]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (studentRef.current && !studentRef.current.contains(event.target)) {
        setShowStudentDropdown(false);
      }
      if (teacherRef.current && !teacherRef.current.contains(event.target)) {
        setShowTeacherDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unassignStudentFromClass = async (student_full_name, teacher_full_name) => {
    setUnassigning(true);
    setError(null);
    setSuccessMessage('');
    try {
      await adminAuthService.unassignStudentFromClass({ student_full_name, teacher_full_name });
      setSuccessMessage('Student unassigned successfully!');
      fetchAssignedStudents();
    } catch (err) {
      setError('Failed to unassign student from class');
    } finally {
      setUnassigning(false);
    }
  };

  const Fetch_Student = async () => {
    try {
      const response = await adminAuthService.Get_Student();
      setAllStudents(response.data);
      console.log("Fetched students:", response.data);
    } catch (err) {
      setError('Failed to fetch students');
    }
  };

  const Fetch_Teacher = async () => {
    try {
      const response = await adminAuthService.Get_Teacher();
      setAllTeachers(response.data);
      console.log("Fetched teachers:", response.data);
    } catch (err) {
      setError('Failed to fetch teachers');
    }
  };

  const assignStudentToClass = async () => {
    if (!studentName || !teacherName || !className) {
      setError('Please fill all fields');
      return;
    }

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

  const fetchAssignedStudents = async () => {
    try {
      const response = await adminAuthService.getAllAssignments();
      setAssignedStudents(response.data);
    } catch (err) {
      setError('Failed to fetch assigned students');
    }
  };

  // Handle student selection from dropdown
  const handleSelectStudent = (student) => {
    setStudentName(student.full_name);
    setShowStudentDropdown(false);
    // Optional: Auto-fill class name if available
    if (student.class_name) {
      setClassName(student.class_name);
    }
  };

  // Handle teacher selection from dropdown
  const handleSelectTeacher = (teacher) => {
    setTeacherName(teacher.full_name);
    setShowTeacherDropdown(false);
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

      {/* Assignment Form Box */}
      <div className="max-w-md mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2">
            <h2 className="text-sm font-semibold text-white">New Assignment</h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {/* Student Name with Dropdown */}
              <div ref={studentRef} className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  placeholder="Search student name..."
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {showStudentDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {studentSuggestions.map((student) => (
                      <div
                        key={student.student_id}
                        onClick={() => handleSelectStudent(student)}
                        className="px-3 py-2 hover:bg-purple-50 cursor-pointer transition-colors border-b last:border-b-0"
                      >
                        <div className="text-sm font-medium text-gray-800">{student.full_name}</div>
                        <div className="text-xs text-gray-500">{student.email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Teacher Name with Dropdown */}
              <div ref={teacherRef} className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Teacher Name
                </label>
                <input
                  type="text"
                  placeholder="Search teacher name..."
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {showTeacherDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {teacherSuggestions.map((teacher) => (
                      <div
                        key={teacher.teacher_id}
                        onClick={() => handleSelectTeacher(teacher)}
                        className="px-3 py-2 hover:bg-purple-50 cursor-pointer transition-colors border-b last:border-b-0"
                      >
                        <div className="text-sm font-medium text-gray-800">{teacher.full_name}</div>
                        <div className="text-xs text-gray-500">{teacher.email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Class Name */}
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

      {/* Assigned Students List Table */}
      {!error && (
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
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {AssignedStudents.map((student, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                              {student.profile_image_url ? (
                                <img src={`http://localhost:3500${student.profile_image_url}`} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-purple-500 text-white text-xs font-bold">
                                  {student.teacher_name?.charAt(0).toUpperCase() || 'T'}
                                </div>
                              )}
                            </div>
                            <span className="text-gray-800 text-xs">{student.teacher_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                              {student.student_profile_image_url ? (
                                <img src={`http://localhost:3500${student.student_profile_image_url}`} alt="" className="w-full h-full object-cover" />
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
                        <td className="px-4 py-2 whitespace-nowrap text-xs">
                          <button
                            onClick={() => unassignStudentFromClass(student.student_name, student.teacher_name)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Unassign
                          </button>
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
      <div className="flex items-center justify-center h-full mt-6">
        <button onClick={() => navigate('/Admin_Dashboard')} className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Back
        </button>
     </div>
    </div>
  )
}

export default Assign_students_to_classes
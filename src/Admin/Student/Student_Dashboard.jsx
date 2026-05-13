import React from 'react';
import { useState, useEffect } from 'react';
import { adminAuthService } from '../../service/adminauth';
import { useNavigate } from 'react-router-dom';
import Delete_Student from './Delete_Student'; 

const Student_Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // State for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedStudentName, setSelectedStudentName] = useState('');

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const fetchStudents = async () => {
  setLoading(true);
  setError('');
  try {
    const response = await adminAuthService.getAllStudents();
    // Log each student's image URL
    if (response.students) {
      response.students.forEach(student => {
        console.log(`Student: ${student.full_name}, Image URL:`, student.profile_image_url);
      });
    }
    
    if (response.success) {
      setStudents(response.students);
      setFilteredStudents(response.students);
    } else {
      setError(response.message || 'Failed to fetch students');
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    setError(error.message || 'An error occurred while fetching students');
  } finally {
    setLoading(false);
  }
};
  const handleViewDetails = (studentId) => {
    navigate("/View_Student", { state: { studentId } });
  };

  const handleAddStudent = () => {
    navigate("/Add_Student");
  }
  const handleback = () => {
    navigate("/Admin_Dashboard");
  };
  const handleEditDetails = (studentId) => {
    navigate("/Edit_Student", { state: { studentId } });
  };

  const handleDelete = (studentId, studentName) => {
    setSelectedStudentId(studentId);
    setSelectedStudentName(studentName);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedStudentId(null);
    setSelectedStudentName('');
  };

  const handleStudentDeleted = () => {
    fetchStudents(); // Refresh the list
    closeDeleteModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
        <p className="text-gray-600">Manage and view all students</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, email or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
          {error}
        </div>
      )}

      {/* Students Grid */}
      {!loading && !error && (
        <div className="max-w-6xl mx-auto">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No students found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <div
                  key={student.student_id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
                >
                  {/* Image - Circular */}
                  <div className="flex justify-center pt-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-purple-500 shadow-md">
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
                  </div>

                  {/* Student Info */}
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {student.full_name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">{student.email}</p>
                    <p className="text-purple-600 text-sm font-semibold mb-2">
                      Class: {student.class_name}
                    </p>
                    
                    {/* Status Badge */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: student.is_active ? '#d1fae5' : '#fee2e2',
                        color: student.is_active ? '#065f46' : '#991b1b'
                      }}
                    >
                      <span className={`w-2 h-2 rounded-full mr-2 ${student.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {student.is_active ? 'Active' : 'Inactive'}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2 justify-center">
                      <button 
                        onClick={() => handleViewDetails(student.student_id)} 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleEditDetails(student.student_id)} 
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(student.student_id, student.full_name)} 
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
       <div className='text-center'>
          <button onClick={handleAddStudent} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
            Add Student
          </button>
          <button onClick={handleback} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition ml-2">
            Back
          </button>
       </div>
      {/* Stats Footer */}
      {!loading && !error && filteredStudents.length > 0 && (
        <div className="text-center mt-8 text-gray-600">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <Delete_Student 
          studentId={selectedStudentId}
          studentName={selectedStudentName}
          onClose={closeDeleteModal}
          onDelete={handleStudentDeleted}
        />
      )}
    </div>
  );
};

export default Student_Dashboard;
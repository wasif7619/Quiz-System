import React, { useState, useEffect } from 'react';
import { adminAuthService } from '../../service/adminauth';
import { useNavigate } from 'react-router-dom';
import Delete_Teacher from './Delete_Teacher';

const Teacher_Dashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // State for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [selectedTeacherName, setSelectedTeacherName] = useState('');

  const handleAdd = () => {
    navigate("/Add_Teacher");
  }
  const handleBack = () => {
    navigate("/Admin_Dashboard");
  }
  const handleViewdetails = (teacherId) => {
    navigate("/View_Teachers", { state: { teacherId } });
  }

  const handleEditdetails = (teacherId) => {
    navigate("/Edit_Teacher", { state: { teacherId } });
  };

  // Updated handleDelete - opens modal instead of navigating
  const handleDelete = (teacherId, teacherName) => {
    setSelectedTeacherId(teacherId);
    setSelectedTeacherName(teacherName);
    setShowDeleteModal(true); // Open the modal
  };

  // Close modal function
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedTeacherId(null);
    setSelectedTeacherName('');
  };

  // Refresh teachers after deletion
  const handleTeacherDeleted = () => {
    fetchTeachers(); // Refresh the list
    closeDeleteModal(); // Close modal
  };

  // Fetch teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Filter teachers based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredTeachers(teachers);
    } else {
      const filtered = teachers.filter(teacher =>
        teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTeachers(filtered);
    }
  }, [searchTerm, teachers]);

  const fetchTeachers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await adminAuthService.getAllTeachers();
      
      if (result.success) {
        setTeachers(result.teachers);
        setFilteredTeachers(result.teachers);
      } else {
        setError(result.message || 'Failed to fetch teachers');
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setError('Failed to load teachers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Teachers</h1>
        <p className="text-gray-600">Manage and view all teachers</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder=" Search by name or email..."
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

      {/* Teachers Grid */}
      {!loading && !error && (
        <div className="max-w-6xl mx-auto">
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No teachers found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher) => (
                <div
                  key={teacher.teacher_id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
                >
                  {/* Image - Circular */}
                  <div className="flex justify-center pt-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-purple-500 shadow-md">
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
                          <span className="text-white text-4xl font-bold">
                            {teacher.full_name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Teacher Info */}
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {teacher.full_name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{teacher.email}</p>
                    
                    {/* Status Badge */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: teacher.is_active ? '#d1fae5' : '#fee2e2',
                        color: teacher.is_active ? '#065f46' : '#991b1b'
                      }}
                    >
                      <span className={`w-2 h-2 rounded-full mr-2 ${teacher.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {teacher.is_active ? 'Active' : 'Inactive'}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2 justify-center">
                      <button onClick={() => handleViewdetails(teacher.teacher_id)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition">
                       View Details
                      </button>
                      <button onClick={()=>handleEditdetails(teacher.teacher_id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition">
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(teacher.teacher_id, teacher.full_name)}  
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
      <div className="text-center p-6">
       <button onClick={handleAdd}className="bg-yellow-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition mr-4">Add Teacher</button>
       <button onClick={handleBack} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm transition">
         Back
       </button>
       </div>
      {/* Stats Footer */}
      {!loading && !error && filteredTeachers.length > 0 && (
        <div className="text-center mt-2 text-gray-600">
          Showing {filteredTeachers.length} of {teachers.length} Teachers
        </div>
      )}

      {/* Delete Modal - Renders as popup when showDeleteModal is true */}
      {showDeleteModal && (
        <Delete_Teacher 
          teacherId={selectedTeacherId}
          teacherName={selectedTeacherName}
          onClose={closeDeleteModal}
          onDelete={handleTeacherDeleted}
        />
      )}
    </div>
  );
};

export default Teacher_Dashboard;
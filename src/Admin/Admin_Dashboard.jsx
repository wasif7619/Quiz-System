import React from 'react'
import teacher from '../assets/teacher.png'
import student from '../assets/student.jpg'
import Assign_students_to_classes from '../assets/Assign_students_to_classes.jpg'
import View_All from '../assets/View_All.jpg'
import { useNavigate } from 'react-router-dom'

const Admin_Dashboard = () => {
    const token = localStorage.getItem('adminToken');
    // console.log('Admin Token:', token);
    const navigate = useNavigate();

  const handleteacher = () => {
    navigate("/Teacher_Dashboard")
  }

  const handlestudent = () => {
    navigate("/Student_Dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      {/* Dashboard Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">Manage your quiz system efficiently</p>
      </div>

      {/* Grid Layout - 2 images per row */}
      <div className="max-w-4xl mx-auto">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Teacher Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-center p-3">
              <img 
                src={teacher}  
                alt="Teacher" 
                className="w-32 h-32 object-contain"
                onClick={handleteacher}
              />
            </div>
            <div className="p-2 text-center">
              <h3 className="font-semibold text-gray-800 text-md">Teachers</h3>
              <p className="text-xs text-gray-500">Manage all teachers</p>
            </div>
          </div>

          {/* Student Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-center p-3">
              <img 
                src={student}  
                alt="Student" 
                className="w-32 h-32 object-contain"
                onClick={handlestudent}
              />
            </div>
            <div className="p-2 text-center">
              <h3 className="font-semibold text-gray-800 text-md">Students</h3>
              <p className="text-xs text-gray-500">Manage all students</p>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Assign Students to Classes Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-center p-3">
              <img 
                src={Assign_students_to_classes}  
                alt="Assign Students to Classes" 
                className="w-32 h-32 object-contain"
              />
            </div>
            <div className="p-2 text-center">
              <h3 className="font-semibold text-gray-800 text-md">Assign Classes</h3>
              <p className="text-xs text-gray-500">Assign students to classes</p>
            </div>
          </div>

          {/* View All Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-center p-3">
              <img 
                src={View_All}  
                alt="View All" 
                className="w-32 h-32 object-contain"
              />
            </div>
            <div className="p-2 text-center">
              <h3 className="font-semibold text-gray-800 text-md">View All</h3>
              <p className="text-xs text-gray-500">View all records</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin_Dashboard
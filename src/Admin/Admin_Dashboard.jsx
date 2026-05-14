import React from 'react'
import teacher from '../assets/teacher.png'
import student from '../assets/student.jpg'
import Assign_students_to_classes from '../assets/Assign_students_to_classes.jpg'
import View_All from '../assets/View_All.jpg'
import { useNavigate } from 'react-router-dom'

const Admin_Dashboard = () => {
    const token = localStorage.getItem('adminToken');
    const adminData = JSON.parse(localStorage.getItem('adminData'));
    console.log('Admin Token:', token);
    console.log('Admin Data:', adminData);
    const navigate = useNavigate();

  const handleteacher = () => {
    navigate("/Teacher_Dashboard")
  }

  const handlestudent = () => {
    navigate("/Student_Dashboard")
  }

  const handleprofile = () => {
    navigate("/Admin_Profile", { state: { from: "/Admin_Dashboard" } });
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      {/* Dashboard Title */}
     <div className="mb-6 relative">
       <div className="flex items-center justify-center">
        {/* Icon on left corner - absolute positioning */}
         <div className="absolute right-60">
          <svg onClick={handleprofile} className="w-12 h-12 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
         </div>
    
    {/* Heading centered */}
    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
  </div>
  <p className="text-gray-500 text-sm text-center mt-2">Manage your quiz system efficiently</p>
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
import class_teacher from "../../assets/class_teacher.jpg";
import time_table from '../../assets/time_table.jpg'
import quiz from '../../assets/quiz.png'
import result from '../../assets/result.jpg'
import { useNavigate } from 'react-router-dom'

const Teacher_DashBoard = () => {
    const teacherData = JSON.parse(localStorage.getItem('teacherData'));
    const token=localStorage.getItem('teacherToken');
    console.log("Teacher Token from Local Storage:", token);
    console.log("Teacher Data from Login:", teacherData);
    const navigate = useNavigate();

  const handleclass_teacher = () => {
    navigate("/Teacher_Class_Dashboard")
  }

  const handlestudent = () => {
    navigate("/Student_Dashboard")
  }

  const handleAssign_students_to_classes = () => {
    navigate("/Assign_students_to_classes")
  }

  const handleViewAll = () => {
    navigate("/View_All")
  }
  
  const handleprofile = () => {
    navigate("/Teacher_Profile", { state: { from: "/Teacher_Dashboard" } });
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
    <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
  </div>
  <p className="text-gray-500 text-sm text-center mt-2">Manage your all activities efficiently</p>
</div>

      {/* Grid Layout - 2 images per row */}
      <div className="max-w-4xl mx-auto">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Teacher Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-center p-3">
              <img 
                src={class_teacher}  
                alt="Teacher" 
                className="w-32 h-32 object-contain"
                onClick={handleclass_teacher}
              />
            </div>
            <div className="p-2 text-center">
              <h3 className="font-semibold text-gray-800 text-md">Classes</h3>
              <p className="text-xs text-gray-500">Manage all classes</p>
            </div>
          </div>

          {/* Student Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-center p-3">
              <img 
                src={time_table}  
                alt="Student" 
                className="w-32 h-32 object-contain"
                onClick={handlestudent}
              />
            </div>
            <div className="p-2 text-center">
              <h3 className="font-semibold text-gray-800 text-md">Time Table</h3>
              <p className="text-xs text-gray-500">View your time table</p>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Assign Students to Classes Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-center p-3">
              <img 
                src={quiz}  
                alt="Quiz" 
                className="w-32 h-32 object-contain"
                onClick={handleAssign_students_to_classes}
              />
            </div>
            <div className="p-2 text-center">
              <h3 className="font-semibold text-gray-800 text-md">Quiz</h3>
              <p className="text-xs text-gray-500">Create and manage quizzes</p>
            </div>
          </div>

          {/* View All Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-center p-3">
              <img 
                src={result}  
                alt="Result" 
                className="w-32 h-32 object-contain"
                onClick={handleViewAll}
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

export default Teacher_DashBoard
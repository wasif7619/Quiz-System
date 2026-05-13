import React from 'react'
import { useNavigate } from 'react-router-dom'

const Main_Page = () => {
  const navigate = useNavigate();
  
  const handleadmin = () => {
    navigate("/Login")
  }
  
  const handleteacher = () => {
    navigate("/Main_page_Teacher")
  }
  
  const handlestudent = () => {
    navigate("/Main_page_student")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-2">
          Quiz System
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Select your role to continue
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={handleadmin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
          >
            Admin
          </button>
          
          <button 
            onClick={handleteacher}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
          >
            Teacher
          </button>
          
          <button 
            onClick={handlestudent}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
          >
            Student
          </button>
        </div>
      </div>
    </div>
  )
}

export default Main_Page
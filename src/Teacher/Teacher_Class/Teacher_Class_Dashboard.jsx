import React, { useEffect, useState } from 'react'
import { teacherAuthService } from '../../service/Teacher';
 const  Teacher_Class_Dashboard=() => {
  const [Classes,setClasses]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response=await teacherAuthService.Classes_Dashboard();
      console.log("Classes Dashboard Response:", response);
      if (response.success) {
        setClasses(response.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div><h1>Teacher Class Dashboard</h1>
     <p>Welcome to your class dashboard!</p>
      <p>Here you can manage your classes, view student progress, and create quizzes.</p>
      <p>Your Classes:</p>
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
                  <tbody className="bg-white">
                    {Classes.map((cls) => (
                      <tr key={cls.id} className="border-b">
                        <td className="px-4 py-2">{cls.teacher_name}</td>
                        <td className="px-4 py-2">{cls.student_name}</td>
                        <td className="px-4 py-2">{cls.class_name}</td>
                        <td className="px-4 py-2">{cls.date}</td>
                        <td className="px-4 py-2">
                          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
    </div>
  )
}
export default Teacher_Class_Dashboard
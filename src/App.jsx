import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main_Page from "./Main_Page";
import Login from "./Admin/Auth/Login";
import ForgetPassword from './Admin/Auth/ForgetPassword'
import Admin_Profile from "./Admin/Admin_Profile";
import Admin_Dashboard from "./Admin/Admin_Dashboard"
import Teacher_Dashboard from "./Admin/Teacher/Teacher_Dashboard";
import Add_Teacher from "./Admin/Teacher/Add_Teacher";
import View_Teachers from "./Admin/Teacher/View_Teachers";
import Edit_Teacher from "./Admin/Teacher/Edit_Teacher";
import Delete_Teacher from "./Admin/Teacher/Delete_Teacher";
import Student_Dashboard from "./Admin/Student/Student_Dashboard";
import Add_Student from "./Admin/Student/Add_Student";
import View_Student_ID from "./Admin/Student/View_Student_ID";
import Edit_Student from "./Admin/Student/Edit_Student";
import Assign_students_to_classes from "./Admin/Assign_students_to_classes";
// Importing Teacher and Student main pages
import Main_page_Teacher from "./Teacher/Auth/Main_page_Teacher"; 
import Main_page_student from "./Student/Auth/Main_page_student";

import './App.css'

function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main_Page />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/ForgetPassword" element={<ForgetPassword />} />
          <Route path="/Admin_Profile" element={<Admin_Profile />} />
          <Route path="/Admin_Dashboard" element={<Admin_Dashboard />} />
          <Route path="/Teacher_Dashboard" element={<Teacher_Dashboard />} />
          <Route path="/Add_Teacher" element={<Add_Teacher />} />
          <Route path="/View_Teachers" element={<View_Teachers />} />
          <Route path="/Edit_Teacher" element={<Edit_Teacher />} />
          <Route path="/Delete_Teacher" element={<Delete_Teacher />} />
          <Route path="/Student_Dashboard" element={<Student_Dashboard />} />
          <Route path="/Add_Student" element={<Add_Student />} />
          <Route path="/View_Student_ID" element={<View_Student_ID />} />
          <Route path="/Edit_Student" element={<Edit_Student />} />
          <Route path="/Assign_students_to_classes" element={<Assign_students_to_classes />} />
          {/* Routes for Teacher and Student main pages */}
          <Route path="/Main_page_Teacher" element={<Main_page_Teacher />} />
          <Route path="/Main_page_student" element={<Main_page_student />} />
        </Routes>
      </BrowserRouter>
     </>
  )
}

export default App

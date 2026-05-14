import React from 'react'

 const  Admin_Profile=() => {
    const token = localStorage.getItem('adminToken');
    const adminData = JSON.parse(localStorage.getItem('adminData'));
    console.log('adminData:', adminData);
    // console.log('Admin Token:', token);
  return (
    <div>Admin_Profile
        <input type="text" value={adminData.full_name} readOnly className="border p-2 rounded mb-4 w-full" />
        <input type="email" value={adminData.email} readOnly className="border p-2 rounded mb-4 w-full" />
        <input type='password' value={adminData.password_hash} readOnly className="border p-2 rounded mb-4 w-full" />
        <img src={adminData.admin_image} alt="Admin" className="w-32 h-32 object-cover rounded-full mb-4" />
    </div>
  )
}
export default Admin_Profile
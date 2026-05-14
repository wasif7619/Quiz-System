import { API_ENDPOINTS, getFullUrl } from '../config/api';

export const adminAuthService = {
  login: async (email, password_hash) => {
    try {
      const url = getFullUrl(API_ENDPOINTS.main.admin.auth.login);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password_hash: password_hash
        })
      });

      const data = await response.json();
      return data;
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminInfo', JSON.stringify(data.admin));
      }
      
      console.log("local storage data:", localStorage.getItem('adminInfo'));
    } catch (error) {
      console.error('Login Error:', error);
      return { success: false, message: error.message };
    }
  },  

  // Get token
  getToken: () => {
    return localStorage.getItem('adminToken');
  },

  // Forget password
  forgotPassword: async (email) => {
    try {
      const url = getFullUrl(API_ENDPOINTS.main.admin.auth.forgotPassword);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Forget Password Error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  },
                //  Teacher Section

// Get all teachers
  getAllTeachers: async () => {
    try {
      const token = adminAuthService.getToken();
      const url = getFullUrl(API_ENDPOINTS.main.admin.teachers.getAll);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get Teachers Error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  },
getteacherbyid: async (teacherId) => {
    try {
      const token = adminAuthService.getToken();
      const url = getFullUrl(API_ENDPOINTS.main.admin.teachers.get_id(teacherId));
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get Teacher Error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  },
  updateteacherbyid: async (teacherId, teacherData) => {
    try {
      const token = adminAuthService.getToken();
      const url = getFullUrl(API_ENDPOINTS.main.admin.teachers.update(teacherId));
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(teacherData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update Teacher Error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  },
  deleteTeacher: async (teacherId) => {
    try {
      const token = adminAuthService.getToken();
      const url = getFullUrl(API_ENDPOINTS.main.admin.teachers.delete(teacherId));
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete Teacher Error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  },
  // Create teacher
createTeacher: async (teacherData) => {
  try {
    const token = adminAuthService.getToken();
    const url = getFullUrl(API_ENDPOINTS.main.admin.teachers.create);
    
    // Create FormData object
    const formData = new FormData();
    formData.append('full_name', teacherData.full_name);
    formData.append('email', teacherData.email);
    formData.append('password_hash', teacherData.password_hash);
    formData.append('is_active', teacherData.is_active);
    
    // Append image file if exists
    if (teacherData.profile_image) {
      formData.append('profile_image', teacherData.profile_image);
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData  // Send FormData, not JSON
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Create Teacher Error:', error);
    return {
      success: false,
      message: error.message
    };
  }
},
                      //student section
  getAllStudents: async () => {
    try {
      const token = adminAuthService.getToken();
      const url = getFullUrl(API_ENDPOINTS.main.admin.students.getAll);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get Students Error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  },
  // Delete student
deleteStudent: async (studentId) => {
  try {
    const token = adminAuthService.getToken();
    const url = getFullUrl(API_ENDPOINTS.main.admin.students.delete(studentId));
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Delete Student Error:', error);
    return {
      success: false,
      message: error.message
    };
  }
},
//view by id 
getstudentbyid: async (studentId) => {
    try {
      const token = adminAuthService.getToken();
      const url = getFullUrl(API_ENDPOINTS.main.admin.students.get_id(studentId));  
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });   

      const data = await response.json();
      return data;
    }
      catch (error) {
      console.error('Get Student Error:', error);
      return {
        success: false,
        message: error.message
      };
    } 
  },
//update by id
updatestudentbyid: async (studentId, studentData) => {
    try {
      const token = adminAuthService.getToken();
      const url = getFullUrl(API_ENDPOINTS.main.admin.students.update(studentId));      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(studentData)
      }); 
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update Student Error:', error);
      return {
        success: false,
        message: error.message
      };
    } 
  },
  // Create student
  createstudent: async (studentData) => {
  try {
    const token = adminAuthService.getToken();
    const url = getFullUrl(API_ENDPOINTS.main.admin.students.create);
    
    // Create FormData object
    const formData = new FormData();
    formData.append('full_name', studentData.full_name);
    formData.append('email', studentData.email);
    formData.append('password_hash', studentData.password_hash);
    formData.append('is_active', studentData.is_active);
    formData.append('class_name', studentData.class_name);
    
    // Append image file if exists
    if (studentData.profile_image) {
      formData.append('profile_image', studentData.profile_image);
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData  // Send FormData, not JSON
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Create Student Error:', error);
    return {
      success: false,
      message: error.message
    };
  }
},
  // Additional student methods (create, update, delete) can be added here
};
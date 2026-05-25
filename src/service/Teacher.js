import { API_ENDPOINTS, getFullUrl } from '../config/api';

export const teacherAuthService = {
  login: async (email, password_hash) => {
    try {
      const url = getFullUrl(API_ENDPOINTS.main.teacher.auth.login);
      
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
        localStorage.setItem('teacherToken', data.token);
        localStorage.setItem('teacherInfo', JSON.stringify(data.teacher));
      }
      
      console.log("local storage data:", localStorage.getItem('teacherInfo'));
    } catch (error) {
      console.error('Login Error:', error);
      return { success: false, message: error.message };
    }
  },  

  // Get token
  getToken: () => {
    return localStorage.getItem('teacherToken');
  },

  // Forget password
  forgotPassword: async (email) => {
    try {
      const url = getFullUrl(API_ENDPOINTS.main.teacher.auth.forgotPassword);
      
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
  }
};

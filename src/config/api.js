const BASE_URL = "http://localhost:3500/api";

export const API_ENDPOINTS = {
  main: {
    admin: {
      auth: {
       login: '/admin/login',
       forgotPassword: '/admin/forgot-password'
      },
      teachers: {
        getAll: '/teachers/Get_All_teachers',
        create: '/teachers/Create_teacher',
        get_id: (id) => `/teachers/Get_teacher/${id}`,
        update: (id) => `/teachers/Update_teacher/${id}`,
        delete: (id) => `/teachers/Delete_teacher/${id}`
      },
      students: {
        getAll: '/students/Get_All_students',
        create: '/students/Create_student',
        get_id: (id) => `/students/Get_student/${id}`,
        update: (id) => `/students/Update_student/${id}`,
        delete: (id) => `/students/Delete_student/${id}`
      },
      Assign: {
        getAll: '/assign-student-to-class/get_all',
        create: '/assign-student-to-class/assign_student_to_class',
        unassign: '/assign-student-to-class/unassign_student_from_class',       
        Get_Student:'/assign-student-to-class/Get_Student',
        Get_Teacher:'/assign-student-to-class/Get_Teacher'
      }
    },
    teacher: {
      auth: {
        login: '/teacher/login',
        forgotPassword: '/teacher/forgot-password'
      },
      quizzes: {
        getAll: '/teacher/quizzes',
        create: '/teacher/quizzes',
        update: (id) => `/teacher/quizzes/${id}`,
        delete: (id) => `/teacher/quizzes/${id}`
      }
    },
    student: {
      auth: {
        login: '/student/login',
        register: '/student/register',
        logout: '/student/logout'
      },
      quizzes: {
        getAll: '/student/quizzes',
        attempt: (id) => `/student/quizzes/${id}/attempt`,
        submit: (id) => `/student/quizzes/${id}/submit`
      }
    }
  }
};

// Helper function to get full URL
export const getFullUrl = (endpoint) => {
  return `${BASE_URL}${endpoint}`;
};

// API configuration object
const apiConfig = {
  baseURL: BASE_URL,
  endpoints: API_ENDPOINTS,
  getFullUrl
};

export default apiConfig;
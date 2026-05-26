import React, { useState } from 'react'
import { teacherAuthService } from '../../service/Teacher';
import { useNavigate } from 'react-router-dom';

const Login_Teacher = () => {
    const [email, setEmail] = useState('');
    const [password_hash, setpassword_hash] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    
    const handleLogin = async (e) => {
      e.preventDefault();
      
      if (!email || !password_hash) {
        setError('Please fill in all fields');
        return;
      }
    
      setError('');
    
      const result = await teacherAuthService.login(email, password_hash);
    
      if (result.success) {
        localStorage.setItem('teacherToken', result.token);
        localStorage.setItem('teacherData', JSON.stringify(result.teacher));
        
       navigate('/Main_page_Teacher');
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    
    };
    

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login Teacher</h1>
        
        {error && <p className="text-red-600 text-center bg-red-50 p-2 rounded-lg mb-4">{error}</p>}
        
        <input 
          type="email" 
          placeholder='Email'
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        
        <input 
          type="password" 
          placeholder='Password' 
          value={password_hash} 
          onChange={(e) => setpassword_hash(e.target.value)} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        
        <p className="text-center text-gray-600 mb-4">
          Don't Get Your account? <a href="/Forget_Password" className="text-purple-600 hover:text-purple-700">Forget Password?</a>
        </p>
        
        <button 
          onClick={handleLogin}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default Login_Teacher
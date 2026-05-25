import  { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { teacherAuthService } from '../../service/Teacher';

const Forget_Password_Teacher = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleback = () => {
        navigate('/Login_Teacher');
    }
    
    const handleForgetPassword = async () => {
        try {
            const response = await teacherAuthService.forgotPassword(email);
            if (response.success) {
                setPassword(response.password);
            } else {
                setError('Forget Password failed: ' + response.message);
            }
        } catch (error) {
            console.error('Forget Password Error:', error);
            setError('An error occurred while processing your request.');
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Forget Password - Teacher</h1>
                
                <input 
                    type="email" 
                    placeholder='Email'
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                
                <button 
                    onClick={handleForgetPassword}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    Submit
                </button>
                <button 
                    onClick={handleback}
                    className="mt-2 w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    Back
                </button>
                
                {/* P tag to show the password */}
                {password && (
                    <p className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg text-center">
                        Your password is: <strong>{password}</strong>
                    </p>
                )}
                
                {error && <p className="mt-4 text-red-600 text-center bg-red-50 p-2 rounded-lg">{error}</p>}
            </div>
        </div>
    )
}

export default Forget_Password_Teacher
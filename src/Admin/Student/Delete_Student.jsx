import React, { useState } from 'react';
import { adminAuthService } from '../../service/adminauth';

const Delete_Student = ({ studentId, studentName, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDelete = async () => {
    if (!studentId) {
      setError('Student ID is missing. Cannot delete student.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('Deleting student with ID:', studentId);
      const result = await adminAuthService.deleteStudent(studentId);
      console.log('Delete response:', result);
      
      if (result.success) {
        setSuccess('Student deleted successfully!');
        setTimeout(() => { 
          onDelete();
          onClose();
        }, 1500);
      } else {
        setError(result.message || 'Failed to delete student. Please try again.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('An error occurred while deleting the student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <div className="flex justify-center pt-6">
          <div className="bg-red-100 rounded-full p-4">
            <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <div className="text-center px-6 pb-6">
          <h3 className="text-2xl font-bold text-gray-800 mt-4 mb-2">Delete Student</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-red-600">{studentName}</span>?{' '}
            This action cannot be undone.
          </p>

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delete_Student;
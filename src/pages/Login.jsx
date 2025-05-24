import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const mockUsers = [
  { username: 'admin', role: 'ADMIN', base: null },
  { username: 'alpha_commander', role: 'BASE_COMMANDER', base: 'Base Alpha' },
  { username: 'alpha_logistics', role: 'LOGISTICS', base: 'Base Alpha' }
];

export default function Login() {
  const [selectedUser, setSelectedUser] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    const user = mockUsers.find(u => u.username === selectedUser);
    if (user) {
      login(user.username, user.role, user.base);
      navigate(location.state?.from?.pathname || '/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Military Login</h2>
        <div className="space-y-4">
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select User Role</option>
            {mockUsers.map(user => (
              <option key={user.username} value={user.username}>
                {user.username} ({user.role})
              </option>
            ))}
          </select>
          
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
          >
            Authenticate
          </button>
        </div>
      </div>
    </div>
  );
}
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600">MilitaryAssets</span>
          </div>
          
          <div className="flex items-center space-x-8">
            {user && (
              <>
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                
                {['ADMIN', 'BASE_COMMANDER'].includes(user.role) && (
                  <NavLink
                    to="/assets"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    Assets
                  </NavLink>
                )}
                
                {['ADMIN', 'LOGISTICS'].includes(user.role) && (
                  <>
                    <NavLink
                      to="/transfers"
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium ${
                          isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`
                      }
                    >
                      Transfers
                    </NavLink>
                    <NavLink
                      to="/purchases"
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium ${
                          isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`
                      }
                    >
                      Purchases
                    </NavLink>
                  </>
                )}
              </>
            )}
            
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user.username} ({user.role})
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
import { Link, useLocation } from 'react-router-dom';
import { 
  FaChartLine, 
  FaBoxOpen, 
  FaExchangeAlt, 
  FaDollarSign 
} from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', icon: <FaChartLine />, text: 'Dashboard' },
    { path: '/assets', icon: <FaBoxOpen />, text: 'Assets' },
    { path: '/transfers', icon: <FaExchangeAlt />, text: 'Transfers' },
    { path: '/purchases', icon: <FaDollarSign />, text: 'Purchases' }
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MilitaryAssets
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:block ml-10">
            <div className="flex space-x-4">
              {navLinks.map((link) => (
                <motion.div
                  key={link.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-2 text-lg">{link.icon}</span>
                    {link.text}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
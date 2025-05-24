import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './component/ProtectedRoute';
import Layout from './component/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Transfers from './pages/Transfers';
import Purchases from './pages/Purchases';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<Layout />}>
            <Route path="/" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'BASE_COMMANDER', 'LOGISTICS']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/assets" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'BASE_COMMANDER']}>
                <Assets />
              </ProtectedRoute>
            } />
            
            <Route path="/transfers" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'LOGISTICS']}>
                <Transfers />
              </ProtectedRoute>
            } />
            
            <Route path="/purchases" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'LOGISTICS']}>
                <Purchases />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
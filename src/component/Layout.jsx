import { Outlet } from 'react-router-dom';
import Navbar from '../pages/Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}
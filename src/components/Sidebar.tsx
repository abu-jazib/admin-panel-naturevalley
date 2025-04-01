import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, MessageSquare, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

const Sidebar = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="bg-white h-screen w-64 fixed left-0 top-0 shadow-lg flex flex-col">
      {/* Logo and Admin Panel */}
      <div className="p-6 flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="w-90 h-90 mb-2" />
        <h1 className="text-2xl font-bold text-[#0d5524] ">Admin Panel</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4 flex-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-[#0d5524] hover:bg-gray-100 ${
              isActive ? 'bg-gray-100 border-r-4 border-[#0d5524]' : ''
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 mr-3 text-[#0d5524]" />
          Dashboard
        </NavLink>
        <NavLink
          to="/blogs"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-[#0d5524] hover:bg-gray-100 ${
              isActive ? 'bg-gray-100 border-r-4 border-[#0d5524]' : ''
            }`
          }
        >
          <FileText className="w-5 h-5 mr-3 text-[#0d5524]" />
          Blogs
        </NavLink>
        <NavLink
          to="/subscribers"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-[#0d5524] hover:bg-gray-100 ${
              isActive ? 'bg-gray-100 border-r-4 border-[#0d5524]' : ''
            }`
          }
        >
          <Users className="w-5 h-5 mr-3 text-[#0d5524]" />
          Subscribers
        </NavLink>
        <NavLink
          to="/forms"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-[#0d5524] hover:bg-gray-100 ${
              isActive ? 'bg-gray-100 border-r-4 border-[#0d5524]' : ''
            }`
          }
        >
          <MessageSquare className="w-5 h-5 mr-3 text-[#0d5524]" />
          Forms
        </NavLink>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center px-6 py-3 text-[#0d5524] hover:bg-gray-100 w-full"
      >
        <LogOut className="w-5 h-5 mr-3 text-[#0d5524]" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
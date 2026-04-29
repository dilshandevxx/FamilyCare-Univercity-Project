import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, FilePlus, Clock, Mail, Settings, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CaregiverSidebar = () => {
  const { logout } = useAuth();

  return (
    <div className="w-64 bg-white min-h-screen fixed left-0 top-0 p-6 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 border-r border-slate-100">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-bold text-teal-600 tracking-tight">
          FamilyCare
        </h1>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
          Caregiver Portal
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        <NavLink 
          to="/caregiver/dashboard" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium'
            }`
          }
        >
          <Home size={18} className="stroke-[2px]" />
          <span className="text-sm">Dashboard</span>
        </NavLink>

        <NavLink 
          to="/caregiver/residents" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium'
            }`
          }
        >
          <Users size={18} className="stroke-[2px]" />
          <span className="text-sm">Assigned Elders</span>
        </NavLink>

        <NavLink 
          to="/caregiver/logs" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium'
            }`
          }
        >
          <FilePlus size={18} className="stroke-[2px]" />
          <span className="text-sm">Add Health Log</span>
        </NavLink>

        <NavLink 
          to="/caregiver/history" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium'
            }`
          }
        >
          <Clock size={18} className="stroke-[2px]" />
          <span className="text-sm">Visit History</span>
        </NavLink>

        <NavLink 
          to="/caregiver/messages" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium'
            }`
          }
        >
          <Mail size={18} className="stroke-[2px]" />
          <span className="text-sm">Messages</span>
        </NavLink>

        <NavLink 
          to="/caregiver/settings" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mt-4 ${
              isActive 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium'
            }`
          }
        >
          <Settings size={18} className="stroke-[2px]" />
          <span className="text-sm">Settings</span>
        </NavLink>
      </nav>

      <div className="mt-auto pt-4">
        <button 
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#C52222] hover:bg-red-800 text-white rounded-xl text-sm font-bold shadow-md transition-colors"
        >
          <Phone size={16} fill="currentColor" />
          Emergency Call
        </button>
      </div>
    </div>
  );
};

export default CaregiverSidebar;
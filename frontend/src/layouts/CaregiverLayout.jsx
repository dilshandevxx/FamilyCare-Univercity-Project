import React from 'react';
import { Bell, User, Settings as SettingsIcon } from 'lucide-react';
import CaregiverSidebar from '../components/caregiver/CaregiverSidebar';

const CaregiverLayout = ({ children, title = "Dashboard" }) => {
  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      {/* Sidebar - Fixed on the left */}
      <CaregiverSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">FamilyCare Caregiver Portal</p>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-[1px] bg-slate-200"></div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800 leading-none">Sarah Mitchell</p>
                <p className="text-[11px] text-teal-600 font-semibold mt-1">Senior Caregiver</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-teal-100 border-2 border-teal-500 flex items-center justify-center overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CaregiverLayout;